import { useEffect } from "react";

const Modal = ({  onClose, apiKeyDetails }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [ onClose]);

  if ( !apiKeyDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">API Key Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-gray-700">API Key:</span>
            <span className="bg-gray-100 p-2 rounded-lg break-all">
              {apiKeyDetails.key}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-gray-700">Usage Limit:</span>
              <p className="text-gray-900">{apiKeyDetails.usageLimit}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Usage Per Hour:
              </span>
              <p className="text-gray-900">{apiKeyDetails.usageLimitPerHour}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Total Usage Count:
              </span>
              <p className="text-gray-900">{apiKeyDetails.usageTotalCount}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Status:</span>
              <p
                className={`${
                  apiKeyDetails.isActive ? "text-green-600" : "text-red-600"
                } font-bold`}
              >
                {apiKeyDetails.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Created At:</span>
              <p className="text-gray-900">
                {new Date(apiKeyDetails.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Expires At:</span>
              <p className="text-gray-900">
                {apiKeyDetails.expiresAt
                  ? new Date(apiKeyDetails.expiresAt).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
