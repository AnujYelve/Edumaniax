import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// MODIFIED: Importing the required components from external files
import IntroScreen from "./IntroScreen";
import InstructionsScreen from "./InstructionsScreen";
import GameNav from "./GameNav";
import Checknow from "@/components/icon/GreenBudget/Checknow"; // Assuming this path is correct from your other files

// =============================================================================
// Mock Contexts and Hooks (for standalone functionality)
// =============================================================================
const useEnvirnoment = () => ({
  completeEnvirnomentChallenge: () => console.log("Challenge marked complete."),
});
const usePerformance = () => ({
  updatePerformance: (data) => console.log("Performance updated:", data),
});

// =============================================================================
// Reusable Components (End Screens are kept here as they are specific to this game's flow)
// =============================================================================

function VictoryScreen({ onContinue, onViewFeedback, accuracyScore, insight }) {
  const { width, height } = useWindowSize();
  return (
    <>
      <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />
      <div className="flex flex-col justify-between h-screen bg-[#0A160E] text-center">
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <img src="/financeGames6to8/trophy-rotating.gif" alt="Rotating Trophy" className="absolute w-full h-full object-contain" />
            <img src="/financeGames6to8/trophy-celebration.gif" alt="Celebration Effects" className="absolute w-full h-full object-contain" />
          </div>
          <h2 className="text-yellow-400 lilita-one-regular text-3xl sm:text-4xl font-bold mt-6">Challenge Complete!</h2>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="w-64 bg-[#09BE43] rounded-xl p-1 flex flex-col items-center">
              <p className="text-black text-sm font-bold mb-1 mt-2">TOTAL ACCURACY</p>
              <div className="bg-[#131F24] mt-0 w-63 h-16 rounded-xl flex items-center justify-center py-3 px-5">
                <img src="/financeGames6to8/accImg.svg" alt="Target Icon" className="w-6 h-6 mr-2" />
                <span className="text-[#09BE43] text-xl font-extrabold">{accuracyScore}%</span>
              </div>
            </div>
            <div className="w-74 bg-[#FFCC00] rounded-xl p-1 flex flex-col items-center">
              <p className="text-black text-sm font-bold mb-1 mt-2">INSIGHT</p>
              <div className="bg-[#131F24] mt-0 w-73 h-16 rounded-xl flex items-center justify-center px-4 text-center">
                <span className="text-[#FFCC00] lilita-one-regular text-sm font-medium italic">{insight}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#2f3e46] border-t border-gray-700 py-4 px-6 flex justify-center gap-6">
          <img src="/financeGames6to8/feedback.svg" alt="Feedback" onClick={onViewFeedback} className="cursor-pointer w-44 h-14 object-contain hover:scale-105 transition-transform duration-200" />
          <img src="/financeGames6to8/next-challenge.svg" alt="Next Challenge" onClick={onContinue} className="cursor-pointer w-44 h-14 object-contain hover:scale-105 transition-transform duration-200" />
        </div>
      </div>
    </>
  );
}

function LosingScreen({ onPlayAgain, onViewFeedback, onContinue, insight, accuracyScore }) {
  return (
    <div className="flex flex-col justify-between h-screen bg-[#0A160E] text-center">
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <img src="/financeGames6to8/game-over-game.gif" alt="Game Over" className="w-64 h-auto mb-6" />
        <p className="text-yellow-400 lilita-one-regular text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Oops! That was close! Wanna Retry?</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="w-64 bg-red-500 rounded-xl p-1 flex flex-col items-center">
            <p className="text-black text-sm font-bold mb-1 mt-2">TOTAL ACCURACY</p>
            <div className="bg-[#131F24] mt-0 w-63 h-16 rounded-xl flex items-center justify-center py-3 px-5">
              <img src="/financeGames6to8/accImg.svg" alt="Target Icon" className="w-6 h-6 mr-2" />
              <span className="text-red-500 text-xl font-extrabold">{accuracyScore}%</span>
            </div>
          </div>
          <div className="w-74 bg-[#FFCC00] rounded-xl p-1 flex flex-col items-center">
            <p className="text-black text-sm font-bold mb-1 mt-2">INSIGHT</p>
            <div className="bg-[#131F24] mt-0 w-73 h-16 rounded-xl flex items-center justify-center px-4 text-center">
              <span className="text-[#FFCC00] lilita-one-regular text-sm font-medium italic">{insight}</span>
            </div>
          </div>
        </div>

      </div>
      <div className="bg-[#2f3e46] border-t border-gray-700 py-4 px-6 flex justify-center gap-6">
        <img src="/financeGames6to8/feedback.svg" alt="Feedback" onClick={onViewFeedback} className="cursor-pointer w-44 h-14 object-contain hover:scale-105 transition-transform duration-200" />
        <img src="/financeGames6to8/retry.svg" alt="Retry" onClick={onPlayAgain} className="cursor-pointer w-44 h-14 object-contain hover:scale-105 transition-transform duration-200" />
        <img src="/financeGames6to8/next-challenge.svg" alt="Next Challenge" onClick={onContinue} className="cursor-pointer w-44 h-14 object-contain hover:scale-105 transition-transform duration-200" />
      </div>
    </div>
  );
}

// MODIFIED: ReviewScreen component updated to a 3x2 grid that fits the screen
function ReviewScreen({ answers, onBackToResults }) {
    return (
        <div className="w-full h-screen bg-[#0A160E] text-white p-6 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold lilita-one-regular mb-6 text-yellow-400 flex-shrink-0">Review Your Answers</h1>
            
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow">
                {answers.map((ans, idx) => (
                    <div 
                        key={idx} 
                        className={`p-4 rounded-lg flex flex-col justify-center ${ans.isCorrect ? 'bg-green-800' : 'bg-red-800/80'} transition-all duration-300`}
                    >
                        <p className="text-gray-300 text-sm mb-2 leading-tight">Q: {ans.description}</p>
                        <p className="font-semibold text-base">
                            Your Answer: 
                            <span className={ans.isCorrect ? 'text-white' : 'text-red-300'}> {ans.selected || "Not Answered"}</span>
                        </p>
                        {!ans.isCorrect && (
                            <p className="font-semibold text-base">
                                Correct Answer: 
                                <span className="text-green-300"> {ans.correctAnswer}</span>
                            </p>
                        )}
                    </div>
                ))}
                {/* This part adds empty divs to maintain the grid structure if there are fewer than 6 answers */}
                {Array(Math.max(0, 6 - answers.length)).fill(0).map((_, index) => (
                    <div key={`empty-${index}`} className="opacity-0"></div>
                ))}
            </div>

            <button 
                onClick={onBackToResults} 
                className="
                  mt-6 px-8 py-3 
                  bg-yellow-600 
                  text-lg 
                  lilita 
                  [text-shadow:1px_2px_0_#000] [text-stroke:1px_black]
                  hover:bg-yellow-700 
                  transition-colors 
                  flex-shrink-0
                  [clip-path:polygon(10%_0,100%_0,90%_100%,0%_100%)]
                  /* --- Background and 3D Effect --- */
                  bg-amber-400 
                  border-b-4 border-amber-600 
                  [clip-path:polygon(8%_0,_100%_0,_92%_100%,_0%_100%)]
                  
                "
            >
                Back to Results
            </button>
        </div>
    );
}


// =============================================================================
// Game Data
// =============================================================================

const options = [
    { name: "Lithosphere", iconUrl: "https://www.svgrepo.com/show/448839/rock.svg" },
    { name: "Atmosphere", iconUrl: "https://www.svgrepo.com/show/443315/atmosphere.svg" },
    { name: "Hydrosphere", iconUrl: "https://www.svgrepo.com/show/450379/hydrosphere.svg" },
    { name: "Biosphere", iconUrl: "https://www.svgrepo.com/show/442751/biosphere.svg" },
];

const questions = [
    { description: "The layer that includes soil, rocks, and land where we build houses and grow food.", correctAnswer: "Lithosphere" },
    { description: "All the water on Earth, including oceans, rivers, lakes, and glaciers.", correctAnswer: "Hydrosphere" },
    { description: "The layer of gases surrounding the Earth that we breathe.", correctAnswer: "Atmosphere" },
    { description: "The part of Earth where life exists, including all plants and animals.", correctAnswer: "Biosphere" },
    { description: "This sphere contains clouds and protects us from the sun's harmful radiation.", correctAnswer: "Atmosphere" },
];

const TIME_LIMIT = 120; // 2 minutes
const TOTAL_QUESTIONS = questions.length;
const PERFECT_SCORE = TOTAL_QUESTIONS * 2;

// =============================================================================
// Reducer Logic
// =============================================================================

const initialState = {
  gameState: "intro",
  introStep: "first",
  currentIndex: 0,
  selected: null,
  score: 0,
  answers: [],
  timeLeft: TIME_LIMIT,
  timerActive: false,
  answerSubmitted: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SHOW_INSTRUCTIONS": return { ...state, introStep: "instructions" };
    case "START_GAME": return { ...initialState, gameState: "playing", timerActive: true };
    case "SELECT_OPTION": if (state.answerSubmitted) return state; return { ...state, selected: action.payload };
    case "SUBMIT_ANSWER": {
      const current = questions[state.currentIndex];
      const isCorrect = current.correctAnswer === state.selected;
      return {
        ...state,
        answers: [...state.answers, { description: current.description, selected: state.selected, correctAnswer: current.correctAnswer, isCorrect }],
        score: isCorrect ? state.score + 2 : state.score,
        answerSubmitted: true,
      };
    }
    case "NEXT_QUESTION":
      if (state.currentIndex + 1 >= TOTAL_QUESTIONS) {
        return { ...state, gameState: "finished", timerActive: false };
      }
      return { ...state, currentIndex: state.currentIndex + 1, selected: null, answerSubmitted: false };
    case "FINISH_GAME": return { ...state, gameState: "finished", timerActive: false };
    case "REVIEW_GAME": return { ...state, gameState: "review" };
    case "BACK_TO_FINISH": return { ...state, gameState: "finished" };
    case "TICK":
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, gameState: "finished", timerActive: false };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "RESET_GAME": return { ...initialState, gameState: "playing", timerActive: true };
    default: return state;
  }
}

// =============================================================================
// Main Game Component
// =============================================================================

const PickTheZone = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    
    useEffect(() => {
        if (state.gameState === "playing" && state.timerActive) {
            const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
            return () => clearInterval(timer);
        }
    }, [state.gameState, state.timerActive]);
    
    const handleSubmit = () => {
        if (state.selected === null) return;
        dispatch({ type: "SUBMIT_ANSWER" });
    };

    const handleNextQuestion = () => {
        dispatch({ type: "NEXT_QUESTION" });
    };
    
    const handlePlayAgain = () => dispatch({ type: "RESET_GAME" });
    const handleViewFeedback = () => dispatch({ type: "REVIEW_GAME" });
    const handleContinue = () => navigate("/environmental/games");

    const currentQuestion = questions[state.currentIndex];
    const buttonText = state.answerSubmitted ? "Continue" : "Check Now";
    const isButtonEnabled = state.answerSubmitted || state.selected !== null;

    if (state.gameState === "intro") {
        return state.introStep === "first"
            ? <IntroScreen onShowInstructions={() => dispatch({ type: "SHOW_INSTRUCTIONS" })} />
            : <InstructionsScreen onStartGame={() => dispatch({ type: "START_GAME" })} />;
    }

    if (state.gameState === "finished") {
        const accuracyScore = Math.round((state.score / PERFECT_SCORE) * 100);
        const isVictory = state.score === PERFECT_SCORE;
        let insightText = "";
        if (isVictory) {
            insightText = "Perfect score! You're a master of the Earth's spheres!";
        } else if (accuracyScore >= 70) {
            insightText = "Great job! You have a solid understanding of our planet's systems.";
        } else {
            insightText = "Good effort! Reviewing the answers will help you learn even more.";
        }
        
        return isVictory
            ? <VictoryScreen accuracyScore={accuracyScore} insight={insightText} onViewFeedback={handleViewFeedback} onContinue={handleContinue} />
            : <LosingScreen accuracyScore={accuracyScore} insight={insightText} onPlayAgain={handlePlayAgain} onViewFeedback={handleViewFeedback} onContinue={handleContinue} />;
    }

    if (state.gameState === "review") {
        return <ReviewScreen answers={state.answers} onBackToResults={() => dispatch({ type: "BACK_TO_FINISH" })} />;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pb-32">
            <GameNav />
            
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 px-4 pt-24">
                <div className="w-full md:w-1/2 bg-[rgba(32,47,54,0.3)] rounded-xl p-6 space-y-4">
                    {options.map((opt) => {
                        const isSelected = state.selected === opt.name;
                        let ringColor = 'ring-gray-600';
                        if (state.answerSubmitted) {
                            if (currentQuestion.correctAnswer === opt.name) {
                                ringColor = 'ring-green-500';
                            } else if (isSelected) {
                                ringColor = 'ring-red-500';
                            }
                        } else if (isSelected) {
                            ringColor = 'ring-green-500';
                        }

                        return (
                            <div 
                                key={opt.name}
                                onClick={() => dispatch({ type: 'SELECT_OPTION', payload: opt.name })}
                                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all bg-[#131f24] ring-2 ${ringColor} shadow-[0_2px_0_0_#000]`}
                            >
                                <div className={`w-8 h-8 rounded-md border-2 ${isSelected ? 'bg-green-600 border-green-400' : 'border-gray-500'} flex items-center justify-center`}>
                                   {isSelected && <span className="text-white text-xl">✓</span>}
                                </div>
                                <span className="flex-1 text-xl font-medium">{opt.name}</span>
                                <img src={opt.iconUrl} alt={opt.name} className="w-8 h-8" />
                            </div>
                        );
                    })}
                </div>

                <div className="w-full md:w-1/2 bg-[rgba(32,47,54,0.3)] rounded-xl p-6 flex items-center justify-center">
                    <p className="text-xl text-center font-medium leading-relaxed">
                        {currentQuestion.description}
                    </p>
                </div>
            </div>

            <div className="w-full h-[12vh] bg-[#28343A] flex justify-center items-center px-[5vw] z-10 fixed bottom-0">
                <div className="w-auto md:w-[12vw] h-[8vh]">
                    <button
                        className="relative w-full h-full cursor-pointer px-8"
                        onClick={state.answerSubmitted ? handleNextQuestion : handleSubmit}
                        disabled={!isButtonEnabled}
                    >
                        <Checknow topGradientColor={"#09be43"} bottomGradientColor={"#068F36"} width="100%" height="100%" />
                        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lilita text-[2.5vh] text-white [text-shadow:0_3px_0_#000] ${!isButtonEnabled && "opacity-50"}`}>
                            {buttonText}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PickTheZone;