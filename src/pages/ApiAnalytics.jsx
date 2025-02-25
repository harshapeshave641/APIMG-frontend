import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FiX, FiActivity, FiCheckCircle, FiXCircle, FiClock, FiDatabase, FiTrendingUp, FiKey } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ApiAnalyticsModal = ({ apiId, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/Analytics/api/${apiId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching API analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [apiId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">Loading...</div>;
  if (!analytics) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">No data available</div>;

  const performanceData = [
    { name: "Total", value: analytics.totalCalls },
    { name: "Success", value: analytics.successCount },
    { name: "Failures", value: analytics.failureCount },
  ];

  const responseTimeData = [
    { time: "Min", ms: analytics.minResponseTime },
    { time: "Avg", ms: analytics.avgResponseTime },
    { time: "Max", ms: analytics.maxResponseTime },
  ];

  const errorTypesData = Object.entries(analytics.errorTypes || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  const apiKeyUsageData = Object.entries(analytics.apiKeysUsed || {}).map(([key, value]) => ({
    key,
    usage: value,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full overflow-y-auto p-8 rounded-lg shadow-xl relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
          <FiX className="text-2xl" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">API Analytics</h1>
          <p className="text-gray-500">Insights for API ID: {apiId}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard icon={<FiActivity />} title="Total Calls" value={analytics.totalCalls} color="bg-blue-100 text-blue-600" />
          <MetricCard icon={<FiCheckCircle />} title="Success Rate" value={`${((analytics.successCount / analytics.totalCalls) * 100).toFixed(1)}%`} color="bg-emerald-100 text-emerald-600" />
          <MetricCard icon={<FiXCircle />} title="Error Rate" value={`${((analytics.failureCount / analytics.totalCalls) * 100).toFixed(1)}%`} color="bg-rose-100 text-rose-600" />
          <MetricCard icon={<FiDatabase />} title="Cache Hits" value={analytics.cacheHits} color="bg-yellow-100 text-yellow-600" />
          <MetricCard icon={<FiTrendingUp />} title="Most Recent Error" value={analytics.mostRecentError || "None"} color="bg-purple-100 text-purple-600" />
          <MetricCard icon={<FiClock />} title="Avg Response Time" value={`${analytics.avgResponseTime} ms`} color="bg-gray-100 text-gray-600" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Success vs Failure Chart */}
          <ChartCard title="API Performance Overview" icon={<FiActivity />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Response Time Distribution */}
          <ChartCard title="Response Time Trends" icon={<FiClock />}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={responseTimeData}>
                <XAxis dataKey="time" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Line type="monotone" dataKey="ms" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", strokeWidth: 2 }} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Error Type Distribution */}
          <ChartCard title="Error Type Breakdown" icon={<FiXCircle />}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={errorTypesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {errorTypesData.map((_, index) => <Cell key={index} fill={["#10b981", "#ef4444", "#3b82f6", "#facc15"][index % 4]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* API Key Usage */}
          <ChartCard title="API Key Usage" icon={<FiKey />}>
            <Sparklines data={apiKeyUsageData.map((entry) => entry.usage)} width={100} height={50}>
              <SparklinesLine color="#10b981" />
            </Sparklines>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-xl ${color} bg-opacity-30`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-30`}>{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="p-6 bg-gray-50 rounded-xl">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">{icon} {title}</h3>
    {children}
  </div>
);

export default ApiAnalyticsModal;
