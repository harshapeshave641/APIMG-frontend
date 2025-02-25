import React from 'react';
import {useNavigate} from 'react-router-dom'
const HomePage = () => {
  const navigate=useNavigate()
  const handleClick=()=>{
    navigate('/log_reg')
  }
  return (
    <>
    <div className="h-screen bg-white text-white flex flex-col">
      
     

      {/* Main Content */}
      <div className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
          API Management Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-900 mb-8 max-w-2xl">
          A powerful platform to manage, monitor your public APIs effortlessly.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300" onClick={handleClick}>
            Get Started
          </button>
          <button className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default HomePage;
