import React from "react";

const FailureResult = ({ onRetry, missingParts = "Context", solutionText = "", loadingSolution = false }) => {
  // Parse solution text
  let solutionData = { systemPrompt: "", userPrompt: "" };
  if (solutionText) {
    try {
      solutionData = JSON.parse(solutionText);
    } catch (e) {
      console.error("FailureResult - Error parsing solutionText:", e);
      solutionData = { systemPrompt: "", userPrompt: "" };
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A160E] flex flex-col justify-between overflow-hidden">
      {/* Center Content - Scrollable */}
      <div className="flex flex-col items-center justify-start flex-1 p-6 overflow-y-auto">
        {/* GAME OVER Text - Pixel Style */}
        <h1
          className="text-red-600 font-bold mb-6 text-center lilita-one-regular shrink-0"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            textShadow: `
              4px 4px 0px #000,
              8px 8px 0px #000,
              12px 12px 0px #000,
              0 0 20px rgba(0,0,0,0.8)
            `,
            letterSpacing: "0.1em",
            lineHeight: "1.2",
            transform: "perspective(500px) rotateX(5deg)",
          }}
        >
          GAME OVER
        </h1>

        {/* Subheading */}
        <p className="text-yellow-400 lilita-one-regular text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-8 shrink-0">
          Oops! That was close! Wanna Retry?
        </p>

        {/* MISSING PARTS Card */}
        <div className="bg-red-600 rounded-xl p-1 border-2 border-black max-w-md w-full mb-6 shrink-0">
          <div className="bg-black rounded-lg p-6 text-center">
            <p className="text-white text-sm sm:text-base font-bold mb-3 lilita-one-regular uppercase">
              MISSING PARTS
            </p>
            <p className="text-white text-xl sm:text-2xl font-bold lilita-one-regular">
              {missingParts}
            </p>
          </div>
        </div>

        {/* Correct Answer Section - Always show (loading or loaded) */}
        <div className="w-full max-w-2xl mb-6 shrink-0">
          <div className="bg-green-600 rounded-xl p-1 border-2 border-black">
            <div className="bg-black rounded-lg p-6">
              <p className="text-white text-sm sm:text-base font-bold mb-4 lilita-one-regular uppercase text-center">
                Correct System Prompt & User Prompt
              </p>
              
              {loadingSolution ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span className="ml-3 text-white text-sm lilita-one-regular">Loading correct answer...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* System Prompt Section */}
                  {solutionData.systemPrompt ? (
                    <div className="bg-[#1a2a2e] rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-green-400 text-sm font-bold mb-2 lilita-one-regular uppercase">
                        Correct System Prompt
                      </p>
                      <div className="bg-[#0f1419] rounded p-3 border border-green-500/30">
                        <p className="text-white text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words">
                          {solutionData.systemPrompt}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* User Prompt Section */}
                  {solutionData.userPrompt ? (
                    <div className="bg-[#1a2a2e] rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-blue-400 text-sm font-bold mb-2 lilita-one-regular uppercase">
                        Correct User Prompt
                      </p>
                      <div className="bg-[#0f1419] rounded p-3 border border-blue-400/30">
                        <p className="text-white text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words">
                          {solutionData.userPrompt}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-[#2f3e46] border-t border-gray-700 py-4 px-6 flex justify-center shrink-0">
        {/* Retry Button - Centered */}
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 border-2 border-white text-white font-bold py-3 px-8 sm:px-12 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 lilita-one-regular text-base sm:text-lg"
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

export default FailureResult;


