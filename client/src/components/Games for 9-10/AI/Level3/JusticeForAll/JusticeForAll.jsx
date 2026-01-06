import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Shield,
  Zap,
  Heart,
  Users,
  Brain,
  CheckCircle,
  XCircle,
  Award,
  Lightbulb,
  Bot,
  Sparkles,
} from "lucide-react";
import { useComputers } from "@/contexts/ComputersContext";
import axios from "axios";
import { usePerformance } from "@/contexts/PerformanceContext"; //for performance
function parsePossiblyStringifiedJSON(text) {
  if (typeof text !== "string") return null;

  // Remove triple backticks and optional "json" after them
  text = text.trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(json)?/, "")
      .replace(/```$/, "")
      .trim();
  }

  // Remove single backticks
  if (text.startsWith("`") && text.endsWith("`")) {
    text = text.slice(1, -1).trim();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
}

const APIKEY = import.meta.env.VITE_API_KEY;

const JusticeForAll = () => {
  const { completeComputersChallenge } = useComputers();
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const previewRef = useRef(null);
  const [challenge1Data, setChallenge1Data] = useState({
    scenarios: [
      {
        id: 1,
        scenario: "AI shortlists job applicants",
        fair: "",
        problems: "",
        fix: "",
      },
      {
        id: 2,
        scenario: "AI gives higher marks to students with neat handwriting",
        fair: "",
        problems: "",
        fix: "",
      },
      {
        id: 3,
        scenario: "AI tracks students through facial recognition",
        fair: "",
        problems: "",
        fix: "",
      },
      {
        id: 4,
        scenario: "AI suggests products based on previous purchases",
        fair: "",
        problems: "",
        fix: "",
      },
    ],
    completed: false,
  });

  const [showBadge, setShowBadge] = useState(null);


  //for performance
  const { updatePerformance } = usePerformance();
  const [startTime, setStartTime] = useState(Date.now());


  useEffect(() => {
    if (showBadge === "ethics") {
      completeComputersChallenge(2, 0);
    }
  }, [showBadge]);


  const updateChallenge1 = (id, field, value) => {
    setChallenge1Data((prev) => ({
      ...prev,
      scenarios: prev.scenarios.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const completeChallenge1 = () => {
    const allFilled = challenge1Data.scenarios.every(
      (s) => s.fair && s.problems && s.fix
    );
    if (allFilled) {
      setChallenge1Data((prev) => ({ ...prev, completed: true }));
      setShowBadge("ethics");

      const endTime = Date.now();
      const studyTimeMinutes = Math.round((endTime - startTime) / 60000);
      const avgResponseTimeSec = (endTime - startTime) / 1000;

      updatePerformance({
        moduleName: "Computers",
        topicName: "humanCenteredAIThinking",
        score: 10,
        accuracy: 100,
        avgResponseTimeSec,
        studyTimeMinutes,
        completed: true,

      });
      setStartTime(Date.now());

    }
  };


  const validClick = () => {
    const allFilled = challenge1Data.scenarios.every(
      (s) => s.fair && s.problems && s.fix
    );
    return allFilled;
  };

  const handleSubmit = async () => {
    // Prevent multiple simultaneous submissions
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    console.log(" Hi");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Evaluate the user's thoughts about whether AI is fair or not in certain scenarios, its problems and an appropriate solution for that. The user is a school student.
    
                    The user's thoughts : ${JSON.stringify(challenge1Data)}
    
    
    ### FINAL INSTRUCTION ###
    Return ONLY raw JSON (no backticks, no markdown, no explanations).
    Value of each field must be a string.
    Value of feedback must be 30 words max.
    Value of tip must be 30 words max.
    No separate feedbacks for different scenarios. Give scenario wiese feedback but all fedbacks for differnet scenarios within a single  field , just "feedback".
    No separate tips for different scenarios. Give all tips in a single field , just "tip".
    Example format:
    {
        feedback : 
        tip : #Always give an actionable activity for improvement as a tip.
    }
    `,
                },
              ],
            },
          ],
        }
      );

      const aiReply = response.data.candidates[0].content.parts[0].text;
      console.log(aiReply);
      const parsed = parsePossiblyStringifiedJSON(aiReply);
      console.log(parsed);
      setResult(parsed);
    } catch (err) {
      setError("Error fetching AI response");
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!result || !previewRef || !previewRef?.current) {
      return;
    }

    setTimeout(() => {
      previewRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [result]);

  const Badge = ({ type, onClose }) => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-6xl mb-4"
        >
          {type === "ethics" ? "⚖️" : "🤖"}
        </motion.div>
        <h3 className="text-2xl font-bold text-purple-600 mb-2">
          🏆 Badge Earned!
        </h3>
        <p className="text-lg text-gray-700 mb-4">
          {type === "ethics" ? "AI Ethics Detective" : "Social Impact Designer"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold"
        >
          Awesome! ✨
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🤖 AI Ethics Adventure 🎮
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Become an AI Ethics Detective and Social Impact Designer!
          </p>
        </motion.div>

        {/* Challenge Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentChallenge(1)}
            className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${currentChallenge === 1
              ? "bg-white text-purple-600 shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
              }`}
          >
            ⚖️ Challenge : Justice for All
            {challenge1Data.completed && (
              <CheckCircle className="inline ml-2 w-5 h-5" />
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="challenge1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-gradient-to-br from-red-200 to-yellow-50 rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                ⚖️ Justice for All (AI Ethics)
              </h2>
              <p className="text-gray-600 text-lg">
                Judge if AI is being fair and help make it better!
              </p>
            </div>

            <div className="space-y-6">
              {challenge1Data.scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200"
                >
                  <h3 className="text-xl font-bold text-purple-700 mb-4">
                    🤖 {scenario.scenario}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        😊 Fair or Unfair?
                      </label>
                      <select
                        value={scenario.fair}
                        onChange={(e) =>
                          updateChallenge1(scenario.id, "fair", e.target.value)
                        }
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Choose...</option>
                        <option value="fair">Fair ✅</option>
                        <option value="unfair">Unfair ❌</option>
                        <option value="depends">It depends 🤔</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⚠️ What Could Go Wrong?
                      </label>
                      <textarea
                        value={scenario.problems}
                        onChange={(e) =>
                          updateChallenge1(
                            scenario.id,
                            "problems",
                            e.target.value
                          )
                        }
                        placeholder="Think about potential problems..."
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none h-20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔧 Fix Suggestion
                      </label>
                      <textarea
                        value={scenario.fix}
                        onChange={(e) =>
                          updateChallenge1(scenario.id, "fix", e.target.value)
                        }
                        placeholder="How can we make it better?"
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none h-20"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-orange-600 mb-4">
                🔍 Reflection Questions:
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>• Should AI ever decide something for a human?</p>
                <p>• What happens if the AI is wrong?</p>
                <p>• Can humans fix AI mistakes?</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                disabled={loading || !validClick()}
                onClick={() => handleSubmit()}
                className={`bg-gradient-to-r 
                ${loading || !validClick() ? "cursor-not-allowed" : "cursor-pointer"}
                   from-green-400 to-blue-500 text-white px-8 py-3 rounded-full  text-xl hover:scale-105 transition duration-300 shadow-lg`}
              >
                💡 Get AI Feedback
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center my-6">
                <div className="w-12 h-12 border-4 border-t-pink-500 border-yellow-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-pink-600 text-xl font-semibold">
                  Thinking...
                </p>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-center mt-4 font-bold">{error}</p>
            )}

            {result && (
              <div
                className="mt-12 w-full sm:w-5/6 md:w-2/3 mx-auto"
                ref={previewRef}
              >
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl text-purple-600 font-bold">
                    📣 Feedback
                  </h2>
                </div>
                <div className="p-6 mt-4 flex justify-center">
                  <div className="bg-purple-200 border-4 p-4 md:p-6 border-fuchsia-400 rounded-3xl shadow-md whitespace-pre-wrap">
                    <div className="text-gray-800 text-xl space-y-4 break-words">
                      <p>{result?.feedback}</p>
                      <p>
                        <strong className="text-blue-400">💡 Tip:</strong>{" "}
                        {result?.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={completeChallenge1}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Complete Challenge 1! 🏆
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="fixed top-20 left-10 text-4xl opacity-30"
        ></motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="fixed top-32 right-20 text-3xl opacity-30"
        ></motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="fixed bottom-20 left-20 text-3xl opacity-30"
        ></motion.div>
      </div>

      <AnimatePresence>
        {showBadge && (
          <Badge type={showBadge} onClose={() => setShowBadge(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JusticeForAll;
