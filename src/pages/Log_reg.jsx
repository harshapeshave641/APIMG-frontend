import React, { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import { Navigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Log_Reg() {
  const [isLogin, setIsLogin] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-white text-3xl font-bold mb-6">Get started with API Management</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <LoginForm
            toggleForm={toggleForm}
            setModalOpen={setModalOpen}
            setModalMessage={setModalMessage}
            setModalType={setModalType}
          />
        ) : (
          <RegisterForm
            toggleForm={toggleForm}
            setModalOpen={setModalOpen}
            setModalMessage={setModalMessage}
            setModalType={setModalType}
          />
        )}
      </div>
      {modalOpen && <Modal message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

const LoginForm = ({ toggleForm, setModalOpen, setModalMessage, setModalType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("User");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res=await axios.post(`${BACKEND_URL}/${role}/login`, { email, password });
      localStorage.setItem("token",res.data.token)
      localStorage.setItem("role",role)
      setModalMessage("Login successful!");
      setModalType("success");
      setModalOpen(true);
      window.location.reload();
    } catch (error) {
      setModalMessage(error.response?.data?.message || "Login failed. Please try again.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="User">User</option>
        <option value="Client">Client</option>
      </select>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Login</button>
      <p className="text-center text-gray-600">Don't have an account? <span onClick={toggleForm} className="text-blue-500 cursor-pointer">Register here</span></p>
    </form>
  );
};

const RegisterForm = ({ toggleForm, setModalOpen, setModalMessage, setModalType }) => {
  const [role, setRole] = useState("User");
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", fullName: "", companyName: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      setError("Please check your input.");
      return;
    }
    if(role==="Client"&&!formData.companyName){
      setError("Please check your input.");
      return;
    }
    try {
      console.log(`${BACKEND_URL}/${role}/register`)
      const res=await axios.post(`${BACKEND_URL}/${role}/register`, formData);
      console.log(res)
      if(res.status!==200){
        setModalMessage(res.message);
        setModalType("error");
      }
      else{
        setModalMessage("Registration successful!");
        setModalType("success");
        localStorage.setItem("token",res.data.token)
        localStorage.setItem("role",role)
      }
      
      setModalOpen(true);
      window.location.reload();

    } catch (error) {
      setModalMessage(error.response?.data?.message || "Registration failed. Please try again.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Role Selection */}
      <select 
        name="role" 
        value={role} 
        onChange={(e) => setRole(e.target.value)} 
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="User">User</option>
        <option value="Client">Client</option>
      </select>

      {/* Show company name field only if Client is selected */}
      {role === "Client" && (
        <input 
          type="text" 
          name="companyName" 
          placeholder="Company Name" 
          value={formData.companyName} 
          onChange={handleChange} 
          required 
          className="w-full px-4 py-2 border rounded-lg"
        />
      )}
      {role === "User" && (
        <input 
          type="text" 
          name="fullName" 
          placeholder="Full Name" 
          value={formData.fullName} 
          onChange={handleChange} 
          required 
          className="w-full px-4 py-2 border rounded-lg"
        />
      )}

      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={formData.password} 
        onChange={handleChange} 
        required 
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input 
        type="password" 
        name="confirmPassword" 
        placeholder="Confirm Password" 
        value={formData.confirmPassword} 
        onChange={handleChange} 
        required 
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Register</button>

      <p className="text-center text-gray-600">
        Already have an account? <span onClick={toggleForm} className="text-blue-500 cursor-pointer">Login here</span>
      </p>
    </form>
  );
};

export default Log_Reg;
