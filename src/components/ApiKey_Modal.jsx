import { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import Modal from "./Modal";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ApiKeyModal({ onClose,apiId,keydata }) {
  const [form, setForm] = useState({
    apiId:keydata?.apiId||apiId||"",
    usageLimit: keydata?.usageLimit||10,
    usageLimitPerHour:keydata?.usageLimitPerHour||"",
    expiresAt:keydata?.expiresAt|| "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Error");
  const [message, setMessage] = useState("Try Again!");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.apiId || !form.usageLimit || !form.usageLimitPerHour || !form.expiresAt) {
        setShow(true);
        setType("Error");
        setMessage("All fields are required!");
        return;
      }
    if(!keydata){
        setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/ApiKey`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShow(true);
      setType("Success");
      setMessage("API Key created successfully");
      window.location.reload();

    } catch (error) {
      console.error("Error:", error);
      setShow(true);
      setType("Error");
    } finally {
      setLoading(false);
    }
    }
    else{
        setLoading(true);
    try {
      const res = await axios.put(`${BACKEND_URL}/ApiKey/${keydata._id}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShow(true);
      setType("Success");
      setMessage("API Key edited successfully");
      window.location.reload();

    } catch (error) {
      console.error("Error:", error);
      setShow(true);
      setType("Error");
    } finally {
      setLoading(false);
    }
    }
    
    
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Generate API Key</h2>
          <div className="space-y-4">
            <div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API ID</label>
              <input
                type="text"
                name="apiId"
                value={form.apiId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Api ID"
              />
            </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Total Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter usage limit"
              />
            </div>  

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit Per Hour</label>
              <input
                type="number"
                name="usageLimitPerHour"
                value={form.usageLimitPerHour}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter usage limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          </div>
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
              {loading ? "Generating..." : "Generate Key"}
            </button>
          </div>
        </div>
      </div>
      {show && <Modal type={type} onClose={() => setShow(false)} message={message} />}
    </>
  );
}
