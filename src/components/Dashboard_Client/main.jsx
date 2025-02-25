import { useState, useEffect } from 'react';
import { FiActivity, FiKey, FiServer, FiSettings, FiUser,FiClipboard ,FiCheck,FiPieChart, FiLock } from 'react-icons/fi';
import AddApiModal from '../Api_Modal';
import ApiKeyModal from '../ApiKey_Modal';
import ApiKeysModal from '../ApiKey_Display';
import axios from 'axios';
import { FiCopy, FiTrash2, FiX ,FiEdit,FiPlus,FiLogOut } from "react-icons/fi"; // Icons for actions
import ClientAnalytics from '../ClientAnalytics';
import ApiAnalyticsModal from '../../pages/ApiAnalytics';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const [email, setEmail] = useState(null);
  const [apiKeyList,setApiKeyList]=useState([])
  const [isApiModalOpen, setApiModalOpen] = useState(false);
  const [isApiKeyModalOpen,setApiKeyModalOpen]=useState(false);
  const [clientId, setClientId] = useState(null);
  const [apiList, setApiList] = useState([]);
  const [filteredApiList, setFilteredApiList] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [methodFilter, setMethodFilter] = useState('all'); 
  const [keydata,setKeydata]=useState(null);
  const [isApiKeyModal,setisApiKeyModal]=useState(false);
  const [showAnalytics,setshowAnalytics]=useState(false);
  const token = localStorage.getItem('token');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        setEmail(payload.email || 'Guest');
        setClientId(payload.clientId);

        fetchApiKeyData();
        fetchApiData()
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const fetchApiData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/Api`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setApiList(res.data.data);
      
      setFilteredApiList(res.data.data); // Initialize filtered list
    } catch (error) {
      console.error('Invalid error', error);
    }
  };

  const fetchApiKeyData=async()=>{
    try {
        const res = await axios.get(`${BACKEND_URL}/ApiKey`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)
        setApiKeyList(res.data.data);
      } catch (error) {
        console.error('Invalid error', error);
      }
  }

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
  };


  
  // Extract email and clientId from the token
  

  // Handle API deletion
  const handleDelete = async (apiId) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/Api/${apiId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Deleted successfully:', res);
      alert('Entry Deleted');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting the entry:', error);
    }
  };

  // Handle API toggle (active/inactive)
  const handleToggle = async (apiId) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/Api/${apiId}/toggle-active`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Toggled successfully:', res);
      alert('Entry toggled');
      window.location.reload();
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  const handleKeyDelete = async (apiId) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/ApiKey/${apiId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Deleted successfully:', res);
      alert('Entry deleted');
      window.location.reload()
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Failed to delete entry');
    }
  };
  

  // Handle search and filter
  useEffect(() => {
    let filtered = apiList;

    // Filter by search query (baseUrl)
    if (searchQuery) {
      filtered = filtered.filter((api) =>
        api.baseUrl.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((api) =>
        statusFilter === 'enabled' ? api.isActive : !api.isActive
      );
    }

    // Filter by method
    if (methodFilter !== 'all') {
      filtered = filtered.filter((api) => api.method === methodFilter);
    }

    setFilteredApiList(filtered);
  }, [searchQuery, statusFilter, methodFilter, apiList]);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiServer className="text-indigo-600 text-xl" />
            <span className="text-xl font-semibold">API Manager</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Welcome, {email}</span>
            <FiLogOut className="text-red-500 hover:text-indigo-600 cursor-pointer" onClick={()=>{localStorage.removeItem("token"),window.location.reload()}} />
            <FiUser className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
  {[
      { label: "Total APIs", value: apiList.length, textColor: "text-gray-700" },
      { label: "Active APIs", value: apiList.filter(api => api.isActive).length, textColor: "text-gray-700" },
      { label: "Disabled APIs", value: apiList.filter(api => !api.isActive).length, textColor: "text-gray-700" },
      { label: "Errors", value: "3", textColor: "text-gray-700" },
      { label: "Total Usage", value: "1.2M", textColor: "text-gray-700" },
      { label: "Requests Per Minute", value: "450", textColor: "text-gray-700" },
      { label: "Average Response Time", value: "200ms", textColor: "text-gray-700" },
      { label: "Success Rate", value: "98%", textColor: "text-gray-700" },
      { label: "Failed Requests", value: "120", textColor: "text-gray-700" },
      { label: "API Latency", value: "150ms", textColor: "text-gray-700" },
      { label: "Rate Limit Hits", value: "23", textColor: "text-gray-700" },
      { label: "Unauthorized Requests", value: "14", textColor: "text-gray-700" },
      { label: "Blocked Requests", value: "7", textColor: "text-gray-700" },
      { label: "Database Query Time", value: "320ms", textColor: "text-gray-700" },
      { label: "Cache Hit Rate", value: "75%", textColor: "text-gray-700" },
      { label: "Top API Consumers", value: "App_XYZ", textColor: "text-gray-700" },
  ].map(({ label, value, textColor }) => (
    <div 
  key={label} 
  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
>
  {/* Content container */}
  <div>
    {/* Label */}
    <div className="flex items-center gap-2 mb-2">
      <div className="h-px w-8 bg-indigo-300/70" />
      <h3 className="text-sm font-semibold uppercase text-indigo-600">{label}</h3>
    </div>

    {/* Value */}
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </div>
</div>

  ))}
</div>


        

        {/* API Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <FiServer className="text-indigo-600" />
          <span>API Management</span>
        </h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          onClick={() => setApiModalOpen(true)}
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New API</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by Base URL"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* API Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">API Name</th>
              <th className="py-3 px-6 text-left">Endpoint</th>
              <th className="py-3 px-6 text-left">Base URL</th>
              <th className="py-3 px-6 text-left">Method</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredApiList.map((api, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* API Name */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <span className="font-medium">{api.name}</span>
                    <button
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => copyToClipboard(api._id)}
                    >
                      <FiClipboard className="w-4 h-4" />
                    </button>
                  </div>
                </td>

                {/* Endpoint */}
                <td className="py-4 px-6">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) =>
                      (e.target.innerText =
                        e.target.innerText === "••••••••" ? api.endpoint : "••••••••")
                    }
                  >
                    ••••••••
                  </button>
                </td>

                {/* Base URL */}
                <td className="py-4 px-6">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) =>
                      (e.target.innerText =
                        e.target.innerText === "••••••••" ? api.baseUrl : "••••••••")
                    }
                  >
                    ••••••••
                  </button>
                </td>

                {/* Method */}
                <td className="py-4 px-6">
                  <span
                    className={`font-semibold ${
                      api.method === "GET"
                        ? "text-green-600"
                        : api.method === "POST"
                        ? "text-blue-600"
                        : api.method === "PUT"
                        ? "text-yellow-600"
                        : api.method === "DELETE"
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {api.method}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-6 text-center">
  <span
    className={`inline-block px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
      api.isActive
        ? "bg-green-100 text-green-600 border border-green-400"
        : "bg-red-100 text-red-600 border border-red-400"
    }`}
  >
    {api.isActive ? "Enabled" : "Disabled"}
  </span>
</td>


                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end space-x-2">
                    {/* API Keys Button */}
                   {/* API Keys Button */}
<button
  className="text-gray-600 hover:text-green-800 px-3 py-1 rounded-lg border border-gray-300 hover:border-green-800 transition-colors flex items-center space-x-2"
  onClick={() => {
    setisApiKeyModal(true);
    setKeydata(api); // This is the modal for managing API Keys
  }}
>
  <FiKey className="w-5 h-5" />
  <span>API Keys</span>
</button>

{/* Delete Button */}
<button
  className="text-gray-600 hover:text-red-800 px-3 py-1 rounded-lg border border-gray-300 hover:border-red-800 transition-colors flex items-center space-x-2"
  onClick={() => handleDelete(api._id)} // Function to delete the API
>
  <FiTrash2 className="w-5 h-5" />
  <span>Delete</span>
</button>

{/* Toggle Status Button */}
<button
  className="text-gray-600 hover:text-blue-800 px-3 py-1 rounded-lg border border-gray-300 hover:border-blue-800 transition-colors flex items-center space-x-2"
  onClick={() => handleToggle(api._id)} // Function to toggle the API's status (enabled/disabled)
>
  <FiLock className="w-5 h-5" />
  <span>Toggle</span>
</button>

{/* Analytics Button */}
<button
  className="text-gray-600 hover:text-purple-800 px-3 py-1 rounded-lg border border-gray-300 hover:border-purple-800 transition-colors flex items-center space-x-2"
  onClick={() => setshowAnalytics(true)} // Function to handle analytics for the specific API
>
  <FiPieChart className="w-5 h-5" />
  <span>Analytics</span>
</button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

         

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <FiKey className="text-indigo-600" />
              <span>API Keys</span>
            </h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" onClick={() => setApiKeyModalOpen(true)}>
              Generate New Key
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          API Key
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          Expires At
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          Usage Limit (Per Hour)
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          Total Usage
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          Usage Limit
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {apiKeyList.map((key, index) => (
        <tr key={index}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          onClick={(e) =>
            (e.target.innerText =
              e.target.innerText === "••••••••" ? key.key : "••••••••")
          }>
          ••••••••
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {key.expiresAt}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {key.usageLimitPerHour}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {key.usageTotalCount}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {key.usageLimit}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex space-x-2">
              <button className="text-indigo-600 hover:text-indigo-900 font-medium" onClick={() => navigator.clipboard.writeText(key.key)}>
               <FiCopy className="w-5 h-5" />
              </button>
              <button className="text-red-600 hover:text-red-900 font-medium" onClick={()=>handleKeyDelete(key._id)}>
                <FiTrash2 className="w-5 h-5" />
              </button>
              <button className="text-green-600 hover:text-red-900 font-medium" onClick={()=>{setKeydata(key),setApiKeyModalOpen(true)}}>
                <FiEdit className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ClientAnalytics/>
        </div>
      </main>

      {isApiModalOpen && (
        <AddApiModal onClose={() => setApiModalOpen(false)} clientId={clientId} />
      )}

{isApiKeyModalOpen && (
        <ApiKeyModal onClose={() => setApiKeyModalOpen(false)} keydata={keydata} />
      )}
      {isApiKeyModal&&(
        <ApiKeysModal onClose={() => setisApiKeyModal(false)}  apiInfo={keydata}/>
      )}
      {showAnalytics && <ApiAnalyticsModal apiId="67b581c1c69bd3fe956204a3" onClose={() => setshowAnalytics(false)} />}

    </>
  );
}