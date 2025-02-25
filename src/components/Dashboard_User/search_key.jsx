import { useState, useEffect } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import Modal from "./Modal"; // Import the Modal component

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function APIKeyTable() {
  const [apiKeys, setApiKeys] = useState([]);
  const [apiDetails, setApiDetails] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchApi, setSearchApi] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApiKey, setSelectedApiKey] = useState(null); // Track selected API key
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [iKey,setiKey]=useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!BACKEND_URL) {
          throw new Error("Backend URL is missing. Check your .env file.");
        }

        // Fetch API Keys
        const apiKeysRes = await axios.get(`${BACKEND_URL}/UserKey`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const apiKeysData = apiKeysRes?.data?.keys || [];
        setApiKeys(apiKeysData);

        // Extract unique apiIds and clientIds
        const apiIds = [...new Set(apiKeysData.map((key) => key.apiId))];
        const clientIds = [...new Set(apiKeysData.map((key) => key.clientId))];

        // Fetch API Details
        const apisRes = apiIds.length
          ? await axios.get(`${BACKEND_URL}/API/all`, {
              params: { ids: apiIds.join(",") },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          : { data: { apis: [] } };
        setApiDetails(apisRes?.data?.data || []);

        // Fetch Client Details
        const clientsRes = clientIds.length
          ? await axios.get(`${BACKEND_URL}/Client`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          : { data: { clients: [] } };
        setClients(clientsRes?.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddKey = async () => {
    if (!iKey.trim()) {
      alert("Empty Input");
      return;
    }
  
    try {
      // Step 1: Check if the API key exists
      const response = await axios.get(`${BACKEND_URL}/ApiKey/key`, {
        params: { key: iKey }, // Ensure correct query parameter
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const apiKeyData = response.data.data;
      if (!apiKeyData || !apiKeyData._id) {
        throw new Error("API key not found");
      }
  
      // Step 2: If valid, send POST request to add key to UserKeys schema
      const res1=await axios.post(
        `${BACKEND_URL}/UserKey`,
        { apikeyId: apiKeyData._id }, // Send the API key's ObjectId
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      alert("API Key successfully added to your account!");
    } catch (error) {
      console.error("Error adding API key:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Invalid API Key");
    }
  };
  

  // Filter API keys
  const filteredKeys = apiKeys.filter((apiKey) => {
    const api = apiDetails.find((a) => a._id === apiKey.apiId);
    const client = clients.find((c) => c._id === apiKey.clientId);
    return (
      (api?.name?.toLowerCase() || "").includes(searchApi.toLowerCase()) &&
      (client?.companyName?.toLowerCase() || "").includes(searchClient.toLowerCase())
    );
  });

  // Handle API key click
  const handleApiKeyClick = (apiKey) => {
    setSelectedApiKey(apiKey);
    setIsModalOpen(true);
  };

  if (loading) return <p className="text-center text-gray-500 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Managed API Keys</h2>
            <p className="text-gray-600 mt-2">View and manage all your API keys.</p>
          </div>
          {/* Search Filters */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by API Name"
              value={searchApi}
              onChange={(e) => setSearchApi(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Search by Client Name"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
  <input
    type="text"
    placeholder="Enter API Key Name"
    onChange={(e) => setiKey(e.target.value)}
    value={iKey}
    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  />
  <button 
    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out"
    onClick={handleAddKey}
  >
    Add Key
  </button>
</div>

      </div>
   
      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                API Key
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                API Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                API Base URL
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                API Endpoint
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                API Method
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Copy cURL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredKeys.length > 0 ? (
              filteredKeys.map((apiKey) => {
                const api = apiDetails.find((a) => String(a._id) === String(apiKey.apiId));
                const client = clients.find((c) => String(c._id) === String(apiKey.clientId));

                return (
                  <tr
                    key={apiKey.key}
                    className="hover:bg-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleApiKeyClick(apiKey)}
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{apiKey.key}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{client?.companyName || "Unknown"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{api?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{api?.baseUrl}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{api?.endpoint || "----"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{api?.method}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {apiKey.createdAt ? new Date(apiKey.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <CopyToClipboard
                        text={`curl -X ${api?.method || "GET"} "${BACKEND_URL}/eval" \
                          -H "Authorization: Bearer ${apiKey.key}" \
                          -H "Content-Type: application/json" \
                          -d '{
                                "base_url": "${api?.baseUrl}",
                                "endpoint": "${api?.endpoint}",
                                "method": "${api?.method}"
                              }'`}
                      >
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <FaCopy className="w-5 h-5" />
                        </button>
                      </CopyToClipboard>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No matching API keys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for API Key Details */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          apiKeyDetails={selectedApiKey}
        />
      )}
    </div>
  );
}