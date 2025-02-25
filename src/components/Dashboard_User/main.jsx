
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FiLogOut } from "react-icons/fi"; // Icons for actions
import APIKeyTable from "./search_key";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for filters
  const [methodFilter, setMethodFilter] = useState("");
  const [baseUrlFilter, setBaseUrlFilter] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const clientsPerPage = 9; // Number of clients per page

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/Client`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data.data);
      } catch (err) {
        setError("Failed to fetch clients. Please try again later.");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  // Fetch APIs for the selected client
  const fetchApis = async (clientId) => {
    if (!clientId) return; // Avoid unnecessary requests
    try {
      const response = await axios.get(`${BACKEND_URL}/Api/${clientId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { clientId },
      });
      setSelectedClient((prev) => ({ ...prev, apis: response.data.data }));
    } catch (err) {
      setError("Failed to fetch APIs. Please try again later.");
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  // Generate a new API key
  const generateApiKey = async (clientId, api) => {
    const form = {
        clientId,
        apiId: api?._id,
        usageLimit: 200,
        usageLimitPerHour: 10,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
    };

    try {
        const res = await axios.post(`${BACKEND_URL}/ApiKey`, form, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // ✅ Ensure we send an object, not a raw value
        const res1 = await axios.post(`${BACKEND_URL}/UserKey`, 
            { apikeyId: res.data.data._id },  // ✅ Wrap in an object
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("UserKey response:", res1.data);

    } catch (error) {
        console.error("Error:", error);
    } 

    setShowModal(false);
};


  // Filter APIs based on the filters
  const filteredApis = selectedClient?.apis?.filter(api => {
    return (
      (methodFilter ? api.method.toLowerCase().includes(methodFilter.toLowerCase()) : true) &&
      (baseUrlFilter ? api.baseUrl.toLowerCase().includes(baseUrlFilter.toLowerCase()) : true) &&
      (endpointFilter ? api.endpoint.toLowerCase().includes(endpointFilter.toLowerCase()) : true) &&
      (nameFilter ? api.name.toLowerCase().includes(nameFilter.toLowerCase()) : true)
    );
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 p-6 font-sans">
  {/* Header */}
  <nav className="bg-white shadow-lg rounded-lg mb-6">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-indigo-700">API Manager</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Welcome!</span>
        <FiLogOut
          className="text-red-500 hover:text-indigo-600 cursor-pointer transition-transform duration-200"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
        />
      </div>
    </div>
  </nav>

  <div className="max-w-7xl mx-auto">
    {/* Search Bar */}
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search clients by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
      />
    </div>

    {/* Clients Grid */}
    {loadingClients ? (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading clients...</span>
      </div>
    ) : error ? (
      <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg shadow-xl">{error}</div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentClients.map((client) => (
            <motion.div
              key={client._id}
              whileHover={{ scale: 1.05, boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedClient(client);
                fetchApis(client._id);
                setShowModal(true);
              }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 cursor-pointer border border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-gray-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 tracking-wide mb-2">{client.companyName.toUpperCase()}</h3>
              <p className="text-gray-500 text-sm font-medium">Last updated: {new Date(client.updatedAt).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-12">
          {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
              } transition duration-200 ease-in-out`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </>
    )}

    <APIKeyTable apiKeys={apiKeys} clients={clients} />
  </div>

  <AnimatePresence>
    {showModal && selectedClient && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-6 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-300 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">{selectedClient.companyName} APIs</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Filter Inputs */}
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter APIs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Filter by Method"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Filter by Base URL"
                value={baseUrlFilter}
                onChange={(e) => setBaseUrlFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Filter by Endpoint"
                value={endpointFilter}
                onChange={(e) => setEndpointFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Filter by Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {filteredApis.length > 0 ? (
              <ul className="space-y-6">
                {filteredApis.map((api) => (
                  <motion.li
                    key={api._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">{api.name}</h3>
                        <div className="mt-1 flex items-center space-x-3 text-xs text-gray-600">
                          <span className="font-medium">Method:</span>
                          <span className="px-2 py-1 rounded bg-gray-100 border border-gray-200 font-mono text-gray-900">
                            {api.method}
                          </span>
                          <span className="font-medium">Status:</span>
                          <span
                            className={`px-2 py-1 rounded ${api.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                          >
                            {api.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-900 text-right">
                        <span className="block">Created</span>
                        <span>{new Date(api.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs font-medium text-gray-900">Endpoint</span>
                        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 font-mono text-blue-900 truncate">
                          {api.endpoint}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">Base URL</span>
                        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200 font-mono text-blue-900 truncate">
                          {api.baseUrl}
                        </div>
                      </div>
                    </div>

                    {/* API Action Buttons */}
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={() => generateApiKey(selectedClient._id,api)}
                        className="text-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:text-white transition"
                      >
                        Procure Api Key
                      </button>
                      
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">No APIs found</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

  );
}