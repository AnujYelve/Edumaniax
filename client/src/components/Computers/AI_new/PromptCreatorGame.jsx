import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import IntroScreen from "./IntroScreen";
import GameNav from "./GameNav";
import SuccessResult from "./SuccessResult";
import FailureResult from "./FailureResult";
import InstructionOverlay from "./InstructionOverlay";
import { createNewGame, evaluatePrompts, getSolution, fetchPoints, addPoints } from "./api";

export default function PromptCreatorGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // AUTH GUARD — Check token before game loads (do not modify game logic)
  const [authReady, setAuthReady] = useState(false);
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
  const [floatingFeedback, setFloatingFeedback] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [loadingSolution, setLoadingSolution] = useState(false);
  // SCORE DISPLAY — do not modify game logic
  const [currentPoints, setCurrentPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(1000);

  // AUTH GUARD — Check authentication before game loads (do not modify game logic)
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("[PromptCreatorGame] Token at game start:", token ? `${token.substring(0, 20)}...` : "MISSING");
    console.log("[PromptCreatorGame] User entered via Computers page:", !!user);
    
    if (!token) {
      console.warn("[PromptCreatorGame] Token missing, redirecting to Computers page");
      navigate("/computer/games");
      return;
    }
    
    if (!user) {
      console.warn("[PromptCreatorGame] User not loaded, waiting for auth...");
      // Wait a bit for AuthContext to initialize
      const timer = setTimeout(() => {
        const stillNoUser = !localStorage.getItem("user");
        if (stillNoUser) {
          console.warn("[PromptCreatorGame] User still not loaded, redirecting");
          navigate("/computer/games");
        } else {
          setAuthReady(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    setAuthReady(true);
  }, [user, navigate]);

  // SCORE DISPLAY — Load score when game starts (do not modify game logic)
  useEffect(() => {
    if (!authReady) return; // Wait for auth to be ready
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[PromptCreatorGame] Token missing, skipping API call");
      return;
    }
    
    const loadScore = async () => {
      try {
        console.log("[FRONTEND] PromptCreatorGame - Loading score on game start");
        const data = await fetchPoints();
        console.log("[FRONTEND] PromptCreatorGame - Points received from backend:", data);
        
        // Only update if data is valid - do NOT reset to 0 on failure
        if (data && data.points !== undefined) {
          const points = data.points;
          const max = data.maxPoints ?? 1000;
          console.log("[FRONTEND] PromptCreatorGame - Setting score state - points:", points, "max:", max);
          setCurrentPoints(points);
          setMaxPoints(max);
          console.log("[FRONTEND] PromptCreatorGame - Score state updated");
        } else {
          console.log("[FRONTEND] PromptCreatorGame - Invalid data received, keeping existing state");
        }
      } catch (error) {
        console.error("[FRONTEND] PromptCreatorGame - Error loading score:", error);
        // Do NOT reset score on failure - keep existing state
        console.log("[FRONTEND] PromptCreatorGame - Keeping existing score state on error");
      }
    };
    loadScore();
  }, [authReady]);

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
      // Debug: Log raw response
      const response = await evaluatePrompts(scenario, systemPrompt, userPrompt);
      console.log("[PROMPT CREATOR] Raw API Response:", response);
      console.log("[PROMPT CREATOR] Backend Status:", response.status);
      
      // PROMPT CREATOR STATUS CHECK FIX — Use backend status field instead of feedback text
      const status = (response.status || "").toUpperCase().trim();
      console.log("[PROMPT CREATOR] Normalized Status:", status);
      
      // Determine correctness from status field only
      const isCorrect = status === "PASS";
      console.log("[PROMPT CREATOR] Is Correct:", isCorrect);
      
      if (isCorrect) {
        // CORRECT ANSWER: Skip popup entirely, go directly to win screen
        setShowIncorrectPopup(false);
        setFloatingFeedback(""); // Clear any floating feedback
        setIsCorrect(true);
        setFeedback(response.feedback || "Great job! Your prompts are correct!");
        setAccuracy(100); // Perfect score for correct answer
        // SCORE DISPLAY — Update score after correct answer (do not modify game logic)
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("[PromptCreatorGame] Token missing, skipping points API call");
        } else {
          try {
            console.log("[FRONTEND] PromptCreatorGame - Correct answer detected, adding points");
            console.log("[FRONTEND] PromptCreatorGame - Current score before update:", currentPoints);
            const pointsData = await addPoints();
            console.log("[FRONTEND] PromptCreatorGame - Points received from backend:", pointsData);
            
            // Only update if data is valid - do NOT reset to 0 on failure
            if (pointsData && pointsData.points !== undefined) {
              const newPoints = pointsData.points;
              const newMax = pointsData.maxPoints ?? maxPoints;
              console.log("[FRONTEND] PromptCreatorGame - Updating score state - new points:", newPoints, "new max:", newMax);
              setCurrentPoints(newPoints);
              setMaxPoints(newMax);
              console.log("[FRONTEND] PromptCreatorGame - Score state after update - currentPoints:", newPoints, "maxPoints:", newMax);
              
              // Refetch score to ensure we have the latest value from DB
              try {
                const refreshedData = await fetchPoints();
                console.log("[FRONTEND] PromptCreatorGame - Refetched score from DB:", refreshedData);
                if (refreshedData && refreshedData.points !== undefined) {
                  setCurrentPoints(refreshedData.points);
                  setMaxPoints(refreshedData.maxPoints ?? maxPoints);
                  console.log("[FRONTEND] PromptCreatorGame - Score state after refetch - currentPoints:", refreshedData.points, "maxPoints:", refreshedData.maxPoints);
                }
              } catch (refetchError) {
                console.error("[FRONTEND] PromptCreatorGame - Error refetching score:", refetchError);
                // Keep the score from addPoints response
              }
            } else {
              console.log("[FRONTEND] PromptCreatorGame - Invalid points data received, keeping existing state");
            }
          } catch (error) {
            console.error("[FRONTEND] PromptCreatorGame - Error updating score:", error);
            // Don't block game flow if score update fails - keep existing score
            console.log("[FRONTEND] PromptCreatorGame - Keeping existing score state on error");
          }
        }
        setSubmitted(true); // Immediately show win screen - triggers early return in render
        return; // Early return to prevent any further processing
      } else {
        // Incorrect answer - use feedback from /evaluate directly
        const feedbackText = response.feedback || "Your prompts need improvement.";
        setFeedback(feedbackText);
        setFloatingFeedback(feedbackText); // Store for floating display after popup closes
        setShowIncorrectPopup(true);
        
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
    if (!solutionText) return { systemPrompt: "", userPrompt: "" };
    
    const text = solutionText.trim();
    let systemPrompt = "";
    let userPrompt = "";
    
    // Pattern 1: Look for [SYSTEM]: and [USER]: format
    const systemBracketMatch = text.match(/\[SYSTEM\]:\s*(.*?)(?=\n\[USER\]:|$)/is);
    const userBracketMatch = text.match(/\[USER\]:\s*(.*?)(?=\n\[SYSTEM\]:|$)/is);
    
    if (systemBracketMatch && userBracketMatch) {
      systemPrompt = systemBracketMatch[1].trim();
      userPrompt = userBracketMatch[1].trim();
    }
    
    // Pattern 2: Look for "System Prompt:" and "User Prompt:" (case insensitive, with optional prefixes)
    if (!systemPrompt || !userPrompt) {
      // Remove option prefixes like "- Option 1:", "- Option 2:", etc.
      const cleanedText = text.replace(/^-\s*Option\s+\d+:\s*/gim, "");
      
      // Try various system prompt patterns
      const systemPatterns = [
        /(?:System\s+Prompt|System|System\s+Input|System\s+Role)[:\s]+(.*?)(?=\n\s*(?:User|User\s+Prompt|User\s+Input|\[USER\]|Explanation|$))/is,
        /System[:\s]+(.*?)(?=\n\s*(?:User|\[USER\]|$))/is
      ];
      
      // Try various user prompt patterns
      const userPatterns = [
        /(?:User\s+Prompt|User|User\s+Input)[:\s]+(.*?)(?=\n\s*(?:System|System\s+Prompt|\[SYSTEM\]|Explanation|$))/is,
        /User[:\s]+(.*?)(?=\n\s*(?:System|\[SYSTEM\]|$))/is
      ];
      
      for (const pattern of systemPatterns) {
        const match = cleanedText.match(pattern);
        if (match) {
          systemPrompt = match[1].trim();
          // Remove any remaining option prefixes from the extracted text
          systemPrompt = systemPrompt.replace(/^-\s*Option\s+\d+:\s*/gim, "").trim();
          break;
        }
      }
      
      for (const pattern of userPatterns) {
        const match = cleanedText.match(pattern);
        if (match) {
          userPrompt = match[1].trim();
          // Remove any remaining option prefixes from the extracted text
          userPrompt = userPrompt.replace(/^-\s*Option\s+\d+:\s*/gim, "").trim();
          break;
        }
      }
    }
    
    // Pattern 3: If still not found, try splitting by double newlines or common separators
    if (!systemPrompt || !userPrompt) {
      // Try splitting by double newlines
      const parts = text.split(/\n\s*\n+/);
      if (parts.length >= 2) {
        // First part might be system, second might be user
        const part1 = parts[0].trim().replace(/^-\s*Option\s+\d+:\s*/gim, "");
        const part2 = parts[1].trim().replace(/^-\s*Option\s+\d+:\s*/gim, "");
        
        // Check if parts contain keywords to identify them
        if (!systemPrompt && (part1.toLowerCase().includes("system") || !part1.toLowerCase().includes("user"))) {
          systemPrompt = part1.replace(/(?:System\s+Prompt|System)[:\s]+/i, "").trim();
        }
        if (!userPrompt && (part2.toLowerCase().includes("user") || !part2.toLowerCase().includes("system"))) {
          userPrompt = part2.replace(/(?:User\s+Prompt|User)[:\s]+/i, "").trim();
        }
        
        // If still not identified, assign by position
        if (!systemPrompt && !userPrompt) {
          systemPrompt = part1;
          userPrompt = part2;
        }
      }
    }
    
    // Clean up extracted prompts - remove any remaining prefixes and extra whitespace
    systemPrompt = systemPrompt.replace(/^-\s*Option\s+\d+:\s*/gim, "").replace(/^(?:System\s+Prompt|System)[:\s]+/i, "").trim();
    userPrompt = userPrompt.replace(/^-\s*Option\s+\d+:\s*/gim, "").replace(/^(?:User\s+Prompt|User)[:\s]+/i, "").trim();
    
    // Debug logging
    console.log("Parsed system prompt:", systemPrompt);
    console.log("Parsed user prompt:", userPrompt);
    
    return {
      systemPrompt: systemPrompt || "",
      userPrompt: userPrompt || "",
    };
  };

  const fetchSolution = async () => {
    if (!scenario || loadingSolution) return;
    
    setLoadingSolution(true);
    try {
      const response = await getSolution(scenario);
      
      // Debug: Log full backend response
      console.log("Raw /solution response:", response);
      console.log("Raw solution string:", response.solution);
      
      const parsed = parseSolution(response.solution || "");
      
      // Debug: Log extracted prompts (also logged in parseSolution)
      console.log("Final parsed system prompt:", parsed.systemPrompt);
      console.log("Final parsed user prompt:", parsed.userPrompt);
      
      setSolutionText(JSON.stringify(parsed)); // Store as JSON string for easy passing
    } catch (error) {
      console.error("Error getting solution:", error);
      setSolutionText(JSON.stringify({ systemPrompt: "", userPrompt: "" }));
    } finally {
      setLoadingSolution(false);
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
    setFloatingFeedback("");
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


  // AUTH GUARD — Show loader if auth not ready (do not modify game logic)
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0A160E] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="lilita-one-regular">Loading...</p>
        </div>
      </div>
    );
  }

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
      <GameNav heartCount={heartCount} currentPoints={currentPoints} maxPoints={maxPoints} />
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

      {/* Floating Feedback Display - Shows after popup closes */}
      {floatingFeedback && !showIncorrectPopup && !submitted && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-30">
          <div className="bg-[#1a2a2e] border-2 border-blue-400 rounded-lg p-4 shadow-lg">
            <h3 className="text-blue-400 text-lg font-bold mb-2 lilita-one-regular flex items-center gap-2">
              💬 Feedback
            </h3>
            <p className="text-white text-sm leading-relaxed lilita-one-regular">
              {floatingFeedback}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

