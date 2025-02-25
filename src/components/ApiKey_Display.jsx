import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCopy, FiTrash2, FiX, FiEdit, FiPlus, FiFilter } from "react-icons/fi";
import ApiKeyModal from "./ApiKey_Modal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

const ApiKeysModal = ({ apiInfo, onClose }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [filteredApiKeys, setFilteredApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApiKeyModalOpen, setisApiKeyModalOpen] = useState(false);
  const [selKey, setSelKey] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    usageLimit: "",
    usagePerHour: "",
  });

  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/ApiKey/${apiInfo._id}`);
        setApiKeys(response.data.data);
        setFilteredApiKeys(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (apiInfo?._id) fetchApiKeys();
  }, [apiInfo]);

  // Handle search filters
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...searchFilters,
      [filterType]: value,
    };

    setSearchFilters(newFilters);

    // Apply both filters
    const filtered = apiKeys.filter((key) => {
      const meetsUsageLimit =
        newFilters.usageLimit === "" || key.usageLimit >= parseInt(newFilters.usageLimit);
      const meetsUsagePerHour =
        newFilters.usagePerHour === "" || key.usageLimitPerHour >= parseInt(newFilters.usagePerHour);

      return meetsUsageLimit && meetsUsagePerHour;
    });

    setFilteredApiKeys(filtered);
  };

  // Handle copying API key to clipboard
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    alert("API Key copied to clipboard!");
  };

  // Handle revoking an API key
  const handleKeyDelete = async (apiId) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/ApiKey/${apiId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Deleted successfully:", res);
      alert("Entry deleted");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting API key:", error);
      alert("Failed to delete entry");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">Manage API Keys</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span>For API: </span>
                <span className="font-semibold">{apiInfo.name}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Action Header with Filters */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">API Keys List</h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Usage Limit Filter */}
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Min Usage Limit"
                value={searchFilters.usageLimit}
                onChange={(e) => handleFilterChange("usageLimit", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <FiFilter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>

            {/* Usage/Hour Filter */}
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Min Usage/Hour"
                value={searchFilters.usagePerHour}
                onChange={(e) => handleFilterChange("usagePerHour", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <FiFilter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>

            {/* Generate New Key Button */}
            <button
              onClick={() => setisApiKeyModalOpen(true)}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
            >
              <FiPlus className="mr-2 w-5 h-5" />
              Generate
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading API keys...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg">
              Error loading API keys: {error}
            </div>
          ) : filteredApiKeys.length === 0 ? (
            <div className="text-center text-gray-500 p-6">
              No API keys found matching your search criteria.
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["API Key", "Expires At", "Usage/Hour", "Total Usage", "Usage Limit", "Status", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApiKeys.map((key) => (
                      <tr key={key._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <span className="font-mono">{key.key}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(key.expiresAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{key.usageLimitPerHour}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{key.usageTotalCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{key.usageLimit}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              key.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {key.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleCopy(key.key)}
                              className="text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                              title="Copy Key"
                            >
                              <FiCopy className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setisApiKeyModalOpen(true);
                                setSelKey(key);
                              }}
                              className="text-gray-500 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                              title="Edit Key"
                            >
                              <FiEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleKeyDelete(key._id)}
                              className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                              title="Delete Key"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          onClose={() => {
            setisApiKeyModalOpen(false);
            setSelKey(null);
          }}
          apiId={apiInfo._id}
          keydata={selKey}
        />
      )}
    </div>
  );
};

export default ApiKeysModal;