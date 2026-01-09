import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroScreen from "./IntroScreen";
import GameNav from "./GameNav";
import SuccessResult from "./SuccessResult";
import FailureResult from "./FailureResult";
import InstructionOverlay from "./InstructionOverlay";
import { createNewGame, evaluatePrompts, getHint, getSolution } from "./api";

export default function PromptCreatorGame() {
  const [showIntro, setShowIntro] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [scenario, setScenario] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [heartCount, setHeartCount] = useState(3);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [hintText, setHintText] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [loadingSolution, setLoadingSolution] = useState(false);
  const navigate = useNavigate();

  // Load scenario when game starts (after intro and instructions)
  useEffect(() => {
    if (!showIntro && !showInstructions) {
      loadNewGame();
    }
  }, [showIntro, showInstructions]);

  const loadNewGame = async () => {
    setLoadingScenario(true);
    try {
      const response = await createNewGame();
      setScenario(response.scenario || "");
    } catch (error) {
      console.error("Error loading scenario:", error);
      setScenario("Error loading scenario. Please try again.");
    } finally {
      setLoadingScenario(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowInstructions(true); // Show instructions after intro
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setShowInstructions(false);
  };

  const handleCheckNow = async () => {
    if (!userPrompt.trim() || !systemPrompt.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const response = await evaluatePrompts(scenario, systemPrompt, userPrompt);
      
      // Normalize backend response for comparison (handle case/format variations)
      const result = (response.result || "").toLowerCase().trim();
      
      // Debug: Log the actual response value
      console.log("Backend response.result:", response.result);
      console.log("Normalized result:", result);
      
      if (["correct", "pass", "passed", "success", "true"].includes(result)) {

        // CORRECT ANSWER: Skip popup entirely, go directly to win screen
        // Clear popup state first, then set correct state
        setShowIncorrectPopup(false);
        setHintText(""); // Clear any existing hint
        setIsCorrect(true);
        setFeedback(response.feedback || "Great job! Your prompts are correct!");
        setAccuracy(100); // Perfect score for correct answer
        setSubmitted(true); // Immediately show win screen - triggers early return in render
        return; // Early return to prevent any further processing
      } else {
        // Incorrect answer
        setFeedback(response.feedback || "Your prompts need improvement.");
        setShowIncorrectPopup(true);
        
        // Automatically fetch hint on incorrect attempt
        fetchHintAutomatically();
        
        // Reduce hearts
        const newHeartCount = heartCount - 1;
        setHeartCount(newHeartCount);
        
        // Check for game over
        if (newHeartCount <= 0) {
          // Fetch solution when game over
          fetchSolution();
          // Game over - will be handled in render
          setTimeout(() => {
            setSubmitted(true);
            setIsCorrect(false);
          }, 2000); // Show popup for 2 seconds before game over
        } else {
          // Increment attempt number for next try
          setAttemptNumber(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error evaluating prompts:", error);
      setFeedback("Error evaluating prompts. Please try again.");
      setShowIncorrectPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const parseSolution = (solutionText) => {
    if (!solutionText) return { systemPrompt: "", userPrompt: "", explanation: "" };
    
    // Try to extract structured information from the solution text
    const text = solutionText.trim();
    
    // Pattern 1: Look for explicit labels like "System Prompt:", "User Prompt:", etc.
    const systemMatch = text.match(/(?:System Prompt|System|System Input)[:\s]+(.*?)(?=\n(?:User|Explanation|$))/is);
    const userMatch = text.match(/(?:User Prompt|User|User Input)[:\s]+(.*?)(?=\n(?:System|Explanation|$))/is);
    const explanationMatch = text.match(/(?:Explanation|Solution|Note)[:\s]+(.*?)$/is);
    
    let systemPrompt = systemMatch ? systemMatch[1].trim() : "";
    let userPrompt = userMatch ? userMatch[1].trim() : "";
    let explanation = explanationMatch ? explanationMatch[1].trim() : "";
    
    // Pattern 2: If no explicit labels, try to split by common separators
    if (!systemPrompt && !userPrompt) {
      const parts = text.split(/\n\s*\n/);
      if (parts.length >= 2) {
        systemPrompt = parts[0].trim();
        userPrompt = parts[1].trim();
        if (parts.length > 2) {
          explanation = parts.slice(2).join("\n\n").trim();
        }
      } else {
        // If it's a single block, treat it as explanation/combined solution
        explanation = text;
      }
    }
    
    return {
      systemPrompt: systemPrompt || "",
      userPrompt: userPrompt || "",
      explanation: explanation || (systemPrompt && userPrompt ? "" : text)
    };
  };

  const fetchSolution = async () => {
    if (!scenario || loadingSolution) return;
    
    setLoadingSolution(true);
    try {
      const response = await getSolution(scenario);
      
      // Debug: Log full backend response
      console.log("Game Over solution response:", response);
      console.log("Raw solution_text:", response.solution_text);
      
      const parsed = parseSolution(response.solution_text || "");
      
      // Debug: Log extracted prompts
      console.log("Correct system prompt:", parsed.systemPrompt);
      console.log("Correct user prompt:", parsed.userPrompt);
      console.log("Parsed solution data:", parsed);
      
      setSolutionText(JSON.stringify(parsed)); // Store as JSON string for easy passing
    } catch (error) {
      console.error("Error getting solution:", error);
      setSolutionText(JSON.stringify({ systemPrompt: "", userPrompt: "", explanation: "Error loading solution. Please try again." }));
    } finally {
      setLoadingSolution(false);
    }
  };

  const fetchHintAutomatically = async () => {
    if (!scenario || loadingHint) return;
    
    setLoadingHint(true);
    try {
      const response = await getHint(scenario, systemPrompt, userPrompt, attemptNumber);
      setHintText(response.solution_text || "No hint available.");
    } catch (error) {
      console.error("Error getting hint:", error);
      setHintText("Error loading hint. Please try again.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setIsCorrect(false);
    setUserPrompt("");
    setSystemPrompt("");
    setHeartCount(3);
    setAttemptNumber(1);
    setFeedback("");
    setAccuracy(0);
    setSolutionText("");
    setHintText("");
    setShowIncorrectPopup(false);
    loadNewGame();
  };


  const closeIncorrectPopup = () => {
    setShowIncorrectPopup(false);
    if (heartCount <= 0) {
      setSubmitted(true);
      setIsCorrect(false);
    }
  };


  if (showIntro) {
    return <IntroScreen />;
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 z-50 bg-transparent flex items-center justify-center">
        <InstructionOverlay onClose={handleStartGame} />
      </div>
    );
  }

  // Show result screens if submitted
  if (submitted) {
    if (isCorrect) {
      return (
        <SuccessResult
          key={scenario}
          onRetry={handleRetry}
          accuracy={accuracy}
          missingParts={feedback}
          points={2}
        />
      );
    } else {
      return (
        <FailureResult
          onRetry={handleRetry}
          missingParts={feedback || "Try again!"}
          solutionText={solutionText}
          loadingSolution={loadingSolution}
        />
      );
    }
  }

  return (
    <>
      <GameNav heartCount={heartCount} />
      <div className="min-h-screen bg-[#0A160E] pt-20 md:pt-50 pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Speech Bubble with Scenario */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="bg-[#1a4d2e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-[#2d6a3f]">
              {loadingScenario ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  <span className="ml-4 text-white text-lg lilita-one-regular">Loading scenario...</span>
                </div>
              ) : (
                <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed lilita-one-regular">
                  {scenario}
                </p>
              )}
            </div>
          </div>

          {/* Two Input Panels Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* User Prompt Panel */}
            <div className="flex flex-col">
              <div className="bg-[#4ade80] rounded-t-xl p-4 shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold text-black lilita-one-regular text-center">
                  User Prompt
                </h2>
              </div>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Type your user prompt here"
                className="flex-1 bg-[#2d3748] text-white p-4 rounded-b-xl border-2 border-t-0 border-[#4ade80] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-none min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lilita-one-regular text-base sm:text-lg placeholder-gray-400"
              />
            </div>

            {/* System Prompt Panel */}
            <div className="flex flex-col">
              <div className="bg-[#fb923c] rounded-t-xl p-4 shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold text-black lilita-one-regular text-center">
                  System Prompt
                </h2>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Type your system prompt here"
                className="flex-1 bg-[#2d3748] text-white p-4 rounded-b-xl border-2 border-t-0 border-[#fb923c] focus:outline-none focus:ring-2 focus:ring-[#fb923c] resize-none min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lilita-one-regular text-base sm:text-lg placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#2f3e46] border-t-4 border-[#1a2e1a] shadow-inner py-3 sm:py-4 flex items-center justify-end px-4 sm:px-8 z-40">
          {/* Check Now Button */}
          <button
            onClick={handleCheckNow}
            disabled={!userPrompt.trim() || !systemPrompt.trim() || loading || loadingScenario}
            className="bg-[#4ade80] hover:bg-[#3bc96f] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg transition-all duration-200 active:scale-95 lilita-one-regular text-sm sm:text-base md:text-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Checking...</span>
              </>
            ) : (
              "Check Now"
            )}
          </button>
        </div>
      </div>

      {/* Incorrect Answer Popup - NEVER show for correct answers */}
      {showIncorrectPopup && !submitted && !isCorrect && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
          <div className="bg-[#131F24] border-2 border-red-500 rounded-2xl p-6 md:p-8 text-center shadow-2xl w-11/12 max-w-md mx-auto">
            <div className="mb-4">
              <h2 className="text-red-500 text-2xl md:text-3xl font-bold mb-4 lilita-one-regular">
                Incorrect
              </h2>
              <div className="bg-[#1a2a2e] rounded-lg p-4 mt-4">
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  {feedback}
                </p>
              </div>
              
              {/* Hint Section */}
              {hintText && (
                <div className="bg-[#1a2a2e] rounded-lg p-4 mt-4 border-l-4 border-yellow-400">
                  <h3 className="text-yellow-400 text-lg font-bold mb-2 lilita-one-regular text-left">
                    💡 Hint
                  </h3>
                  {loadingHint ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                      <span className="ml-3 text-white text-sm lilita-one-regular">Loading hint...</span>
                    </div>
                  ) : (
                    <p className="text-white text-sm sm:text-base leading-relaxed text-left lilita-one-regular">
                      {hintText}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={closeIncorrectPopup}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors lilita-one-regular"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Persistent Hint Display */}
      {hintText && !showIncorrectPopup && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-30">
          <div className="bg-[#1a2a2e] border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
            <h3 className="text-yellow-400 text-lg font-bold mb-2 lilita-one-regular flex items-center gap-2">
              💡 Hint
            </h3>
            <p className="text-white text-sm leading-relaxed lilita-one-regular">
              {hintText}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

