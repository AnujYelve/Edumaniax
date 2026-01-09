import React from "react";

const SuccessResult = ({ onRetry, accuracy = 88, missingParts = "Context", points = 2 }) => {

  return (
    <div className="fixed inset-0 z-50 bg-[#0A160E] flex flex-col justify-between overflow-hidden">
      {/* Simple CSS-based Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Trophy Icon */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-4">
          {/* Golden Trophy SVG */}
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Trophy Base */}
            <rect x="70" y="160" width="60" height="20" rx="5" fill="#8B4513" />
            {/* Trophy Cup */}
            <path
              d="M60 80 L60 160 L140 160 L140 80 Q140 40 100 40 Q60 40 60 80 Z"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="3"
            />
            {/* Trophy Handle Left */}
            <path
              d="M60 80 Q40 80 40 100 Q40 120 60 120"
              stroke="#FFD700"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Trophy Handle Right */}
            <path
              d="M140 80 Q160 80 160 100 Q160 120 140 120"
              stroke="#FFD700"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Star on Trophy */}
            <path
              d="M100 100 L105 115 L120 115 L108 123 L113 138 L100 130 L87 138 L92 123 L80 115 L95 115 Z"
              fill="#FFA500"
            />
          </svg>
        </div>

        {/* Star Badge with Points */}
        <div className="relative mb-6">
          <div className="relative">
            {/* Star Background */}
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 10 L55 35 L80 35 L60 50 L65 75 L50 60 L35 75 L40 50 L20 35 L45 35 Z"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="2"
              />
            </svg>
            {/* Points Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-xl sm:text-2xl lilita-one-regular">
                {points}+
              </span>
              <span className="text-white text-xs sm:text-sm font-semibold lilita-one-regular">
                Points
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-green-400 lilita-one-regular text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center">
          Yay! Prompt is correct
        </h2>

        {/* Two Info Cards */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 w-full max-w-2xl px-4">
          {/* TOTAL ACCURACY Card */}
          <div className="flex-1 bg-green-500 rounded-xl p-1 border-2 border-black">
            <div className="bg-[#131F24] rounded-lg p-4 text-center">
              <p className="text-white text-sm sm:text-base font-bold mb-2 lilita-one-regular">
                TOTAL ACCURACY
              </p>
              <div className="flex items-center justify-center gap-2">
                {/* Checkmark Icon */}
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-400 text-3xl sm:text-4xl font-extrabold lilita-one-regular">
                  {accuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* MISSING PARTS Card */}
          <div className="flex-1 bg-green-500 rounded-xl p-1 border-2 border-black">
            <div className="bg-[#131F24] rounded-lg p-4 text-center">
              <p className="text-white text-sm sm:text-base font-bold mb-2 lilita-one-regular">
                MISSING PARTS
              </p>
              <p className="text-green-400 text-xl sm:text-2xl font-bold lilita-one-regular">
                {missingParts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-[#2f3e46] border-t border-gray-700 py-4 px-6 flex justify-center shrink-0">
        {/* Try Again Button */}
        <button
          onClick={onRetry}
          className="bg-green-500 hover:bg-green-600 border-2 border-white text-white font-bold py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 lilita-one-regular text-base sm:text-lg"
        >
          <span>Try Again</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessResult;

