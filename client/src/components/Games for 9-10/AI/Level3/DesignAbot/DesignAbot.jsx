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
import axios from "axios";
import { useComputers } from "@/contexts/ComputersContext";
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

const DesignAbot = () => {
  const { completeComputersChallenge } = useComputers();
  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const previewRef = useRef(null);

  //for performance
  const { updatePerformance } = usePerformance();
  const [startTime, setStartTime] = useState(Date.now());

  console.log("Hi");

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

  const [challenge2Data, setChallenge2Data] = useState({
    botName: "",
    problem: "",
    targetUsers: "",
    learnsFrom: "",
    steps: ["", "", ""],
    makesLifeBetter: "",
    ethicalFeatures: "",
    completed: false,
  });

  const [showBadge, setShowBadge] = useState(null);

  useEffect(() => {
    if (challenge2Data.completed) {
      completeComputersChallenge(2, 1);
    }
  }, [challenge2Data.completed]);

  const updateChallenge2 = (field, value) => {
    setChallenge2Data((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(challenge2Data);
  };

  const updateStep = (index, value) => {
    setChallenge2Data((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const completeChallenge2 = () => {
    const allFilled =
      challenge2Data.botName &&
      challenge2Data.problem &&
      challenge2Data.targetUsers &&
      challenge2Data.learnsFrom &&
      challenge2Data.steps.every((step) => step) &&
      challenge2Data.makesLifeBetter &&
      challenge2Data.ethicalFeatures;

    if (allFilled) {
      setChallenge2Data((prev) => ({ ...prev, completed: true }));
      setShowBadge("designer");

      const endTime = Date.now();
      const studyTimeMinutes = Math.round((endTime - startTime) / 60000);
      const avgResponseTimeSec = ((endTime - startTime) / 1000); // whole task as one

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
    const allFilled =
      challenge2Data.botName &&
      challenge2Data.problem &&
      challenge2Data.targetUsers &&
      challenge2Data.learnsFrom &&
      challenge2Data.steps.every((step) => step) &&
      challenge2Data.makesLifeBetter &&
      challenge2Data.ethicalFeatures;

    return allFilled;
  };

  console.log(challenge2Data);

  const handleSubmit = async () => {
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
                  text: `Evaluate the user's thoughts about designing an AI bot. The user is a school student.
  
                  The user's thoughts : ${JSON.stringify(challenge2Data)}
  
  
  ### FINAL INSTRUCTION ###
  Return ONLY raw JSON (no backticks, no markdown, no explanations).
  Value of each field must be a string.
  Value of feedback must be 30 words max.
  Value of tip must be 30 words max.
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
            onClick={() => setCurrentChallenge(2)}
            className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${currentChallenge === 2
              ? "bg-white text-purple-600 shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
              }`}
          >
            🤖 Challenge : Design-A-Bot
            {challenge2Data.completed && (
              <CheckCircle className="inline ml-2 w-5 h-5" />
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="challenge2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-gradient-to-br from-red-200 to-yellow-50 rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                🤖 Design-A-Bot for Good
              </h2>
              <p className="text-gray-600 text-lg">
                Build an AI system to solve a real-world problem!
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200"
                >
                  <label className="block text-lg font-bold text-green-600 mb-3">
                    🤖 Bot Name:
                  </label>
                  <input
                    type="text"
                    value={challenge2Data.botName}
                    onChange={(e) => {
                      console.log("Hi");
                      updateChallenge2("botName", e.target.value);
                    }}
                    placeholder="Give your AI a cool name!"
                    className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
                >
                  <label className="block text-lg font-bold text-purple-600 mb-3">
                    🎯 Problem it Solves:
                  </label>
                  <input
                    type="text"
                    value={challenge2Data.problem}
                    onChange={(e) =>
                      updateChallenge2("problem", e.target.value)
                    }
                    placeholder="What problem will it solve?"
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200"
                >
                  <label className="block text-lg font-bold text-orange-600 mb-3">
                    👥 Target Users:
                  </label>
                  <input
                    type="text"
                    value={challenge2Data.targetUsers}
                    onChange={(e) =>
                      updateChallenge2("targetUsers", e.target.value)
                    }
                    placeholder="Who will use your AI?"
                    className="w-full p-4 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200"
                >
                  <label className="block text-lg font-bold text-cyan-600 mb-3">
                    🧠 What it Learns From:
                  </label>
                  <input
                    type="text"
                    value={challenge2Data.learnsFrom}
                    onChange={(e) =>
                      updateChallenge2("learnsFrom", e.target.value)
                    }
                    placeholder="What data will it learn from?"
                    className="w-full p-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200"
              >
                <label className="block text-lg font-bold text-indigo-600 mb-3">
                  ⚡ How it Works (Step-by-Step):
                </label>
                {challenge2Data.steps.map((step, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}: What does your AI do?`}
                      className="w-full p-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                    />
                  </div>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
                >
                  <label className="block text-lg font-bold text-green-600 mb-3">
                    ✨ How it Makes Life Better:
                  </label>
                  <textarea
                    value={challenge2Data.makesLifeBetter}
                    onChange={(e) =>
                      updateChallenge2("makesLifeBetter", e.target.value)
                    }
                    placeholder="Describe the positive impact..."
                    className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none resize-none h-24 text-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border-2 border-pink-200"
                >
                  <label className="block text-lg font-bold text-pink-600 mb-3">
                    ⚖️ What Makes it Ethical and Fair:
                  </label>
                  <textarea
                    value={challenge2Data.ethicalFeatures}
                    onChange={(e) =>
                      updateChallenge2("ethicalFeatures", e.target.value)
                    }
                    placeholder="How will you ensure fairness?"
                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none resize-none h-24 text-lg"
                  />
                </motion.div>
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
                  onClick={completeChallenge2}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Complete Challenge ! 🚀
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

export default DesignAbot;
