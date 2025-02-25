import { useState } from "react";
import { FiX } from "react-icons/fi"; 
import axios from "axios";
import Modal from "./Modal";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AddApiModal({ onClose, onApiAdded ,clientId}) {
    console.log("This is the man ",clientId)
  const [form, setForm] = useState({
    clientId,
    baseUrl: "",
    endpoint: "",
    method: "GET",
    apiKey: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Error");
  const [message,setMessage]=useState("Try Again !")
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        console.log(token)
      const res=await axios.post(`${BACKEND_URL}/Api`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShow(true);
      setType("Success");
      setMessage("Api created successfully")
      window.location.reload();

      
    } catch (error) {
      console.error("Error:", error);

      setShow(true);
      setType("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-gray-600" />
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Add API</h2>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter API name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base URL
              </label>
              <input
                type="text"
                name="baseUrl"
                value={form.baseUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter base URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endpoint
              </label>
              <input
                type="text"
                name="endpoint"
                value={form.endpoint}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter endpoint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform API Key
              </label>
              <input
                type="text"
                name="apiKey"
                value={form.apiKey}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter API key"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={() => setForm({ ...form, isActive: !form.isActive })}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Saving..." : "Add API"}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Modal at the Bottom */}
      {show && (
          <Modal type={type} onClose={() => setShow(false)} message={message}/>
        
      )}
    </>
  );
}
