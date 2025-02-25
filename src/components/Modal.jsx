import { XCircle, CheckCircle, X } from "lucide-react";

const Modal = ({ message, type, onClose }) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose} // Close when clicking outside
    >
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border"
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {type === "error" ? (
              <XCircle className="text-red-600" size={24} />
            ) : (
              <CheckCircle className="text-green-600" size={24} />
            )}
            <h2 className={`text-lg font-semibold ${type === "error" ? "text-red-600" : "text-green-600"}`}>
              {type === "error" ? "Error" : "Success"}
            </h2>
          </div>
          
          {/* Close Button (X) */}
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-700">{message}</p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
