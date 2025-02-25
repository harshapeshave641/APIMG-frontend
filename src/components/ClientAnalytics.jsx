import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { FiActivity, FiCheckCircle, FiXCircle, FiClock, FiServer, FiTrendingUp, FiDatabase, FiBarChart2 } from 'react-icons/fi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ClientAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/Analytics/client`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching client analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!analytics) return (
    <div className="text-center p-8 bg-rose-50 rounded-xl">
      <p className="text-rose-600 font-medium">Data unavailable - Please try again later</p>
    </div>
  );

  // Chart data configurations
  const chartData = [
    { name: 'Total', value: analytics.totalCalls },
    { name: 'Success', value: analytics.successCount },
    { name: 'Failure', value: analytics.failureCount },
  ];

  const responseTimeData = [
    { time: 'Min', ms: analytics.minResponseTime },
    { time: 'Avg', ms: analytics.avgResponseTime },
    { time: 'Max', ms: analytics.maxResponseTime },
  ];

  const errorTypesData = Object.entries(analytics.errorTypes || {}).map(([key, value]) => ({
    name: key,
    value
  }));

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#facc15', '#f97316'];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overall Analytics</h1>
        <p className="text-gray-500">Performance metrics for your API consumption</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard icon={<FiActivity className="w-6 h-6"/>} title="Total Calls" value={analytics.totalCalls} color="bg-blue-100 text-blue-600" />
        <MetricCard icon={<FiCheckCircle className="w-6 h-6"/>} title="Success Rate" value={`${((analytics.successCount / analytics.totalCalls) * 100).toFixed(1)}%`} color="bg-emerald-100 text-emerald-600" />
        <MetricCard icon={<FiXCircle className="w-6 h-6"/>} title="Error Rate" value={`${((analytics.failureCount / analytics.totalCalls) * 100).toFixed(1)}%`} color="bg-rose-100 text-rose-600" />
        <MetricCard icon={<FiDatabase className="w-6 h-6"/>} title="Cache Hits" value={analytics.cacheHits} color="bg-yellow-100 text-yellow-600" />
        <MetricCard icon={<FiTrendingUp className="w-6 h-6"/>} title="Most Used API" value={analytics.mostUsedApi} color="bg-purple-100 text-purple-600" />
        <MetricCard icon={<FiTrendingUp className="w-6 h-6"/>} title="Least Used API" value={analytics.leastUsedApi} color="bg-gray-100 text-gray-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiServer className="text-gray-600"/> Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Distribution */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-gray-600"/> Response Time Trends
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={responseTimeData}>
              <XAxis dataKey="time" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Line type="monotone" dataKey="ms" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} />
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Error Type Distribution */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiXCircle className="text-gray-600"/> Error Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={errorTypesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {errorTypesData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* API Usage Trend */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-gray-600"/> API Usage Trend
          </h3>
          <Sparklines data={analytics.usageTrend} width={100} height={50}>
            <SparklinesLine color="#10b981" />
            
          </Sparklines>
          <p>No data available</p>
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

export default ClientAnalytics;
