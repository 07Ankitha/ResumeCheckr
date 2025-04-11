import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LowScorePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LowScorePopup({ isOpen, onClose }: LowScorePopupProps) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isOpen]);

  if (!isOpen || !showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">
            Resume Needs Improvement
          </h2>
          <p className="text-gray-700 mb-8 text-center text-lg">
            Your resume score is below the recommended threshold. Our
            professional templates can help you create a more impactful resume
            that stands out to employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Analysis
            </button>
            <button
              onClick={() => {
                router.push("/templates");
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >
              Explore Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
