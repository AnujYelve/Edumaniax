import React from "react";
import { motion } from "framer-motion";
import CancelIcon from "/financeGames6to8/button-cancel.svg";

const InstructionOverlay = ({ onClose }) => {
  const tools = ["📝 User Prompt", "⚙️ System Prompt"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:overflow-hidden overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#0e341d]  shadow-xl w-[95%] md:w-[1000px] text-white z-10 border border-gray-700 max-h-[90vh] rounded-xl flex flex-col"
      >
        {/* Cancel button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-[-20px] md:right-[-20px]
          w-[50px] h-[35px] sm:w-[70px] sm:h-[50px] md:w-[103px] md:h-[68px]
          rounded-full shadow-md hover:scale-110 transition-transform z-50"
        >
          <img
            src={CancelIcon}
            alt="Close"
            className="w-full h-full object-contain"
          />
        </button>

        {/* Top nav */}
        <div className="flex justify-center items-center bg-[#28343A] px-5 py-3 border-b border-gray-700 flex-shrink-0 rounded-t-xl">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-xl sm:text-2xl md:text-3xl lilita-one-regular font-bold text-white"
          >
            How to Play?
          </motion.h2>
        </div>

        {/* Content */}
        {/* OVERLAY UI CLEANUP — spacing & readability */}
        <div className="flex flex-col lg:flex-row p-3 sm:p-4 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Game Preview */}
          <div className="w-full lg:ml-1 max-w-5xl mx-auto border border-[#F3F4F6] rounded-xl p-4 sm:p-5 bg-[#00260E] order-2 lg:order-1 text-center">
            {/* Demo Prompt */}
            <motion.h2
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-white lilita-one-regular"
            >
              Prompt Master Challenge 🎯
            </motion.h2>

            {/* Problem Statement */}
            <p className="text-gray-200 text-sm sm:text-base mb-3">
              <span className="font-bold text-yellow-300">
                Problem Statement:
              </span>{" "}
              You'll be given a scenario. Your task is to craft the perfect User Prompt and System Prompt to solve it!
            </p>

            {/* Mission Highlight */}
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-4 bg-[#1a2a2e] rounded-lg p-3"
            >
              <p className="font-bold mb-2 text-white">🎯 Mission</p>
              <p className="text-gray-300 text-sm">
                Read the scenario carefully. Then create a{" "}
                <span className="text-yellow-300 font-semibold">
                  User Prompt
                </span>{" "}
                and{" "}
                <span className="text-yellow-300 font-semibold">
                  System Prompt
                </span>{" "}
                that will help an AI solve the challenge. Click{" "}
                <b>"Check Now"</b> to see if your prompts are correct!
              </p>
            </motion.div>

            {/* Tips */}
            <div className="mt-4 text-left bg-[#0d1b1e] p-3 rounded-lg">
              <p className="text-green-300 font-bold mb-2 text-sm">💡 Tips</p>
              <ul className="list-disc list-inside text-gray-300 text-xs sm:text-sm space-y-1">
                <li>User Prompt: What you want the AI to do</li>
                <li>System Prompt: How the AI should behave or think</li>
                <li>Be specific and clear in your prompts</li>
                <li>Use the Hint button if you get stuck</li>
              </ul>
            </div>

            {/* HEARTS EXPLANATION — UX CLARITY */}
            <div className="mt-3 text-left bg-[#1a2a2e] border-2 border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 font-bold mb-2 text-sm flex items-center gap-2">
                ❤️ Hearts = Attempts
              </p>
              <p className="text-gray-300 text-xs sm:text-sm leading-snug">
                You get <span className="font-semibold text-white">3 chances</span> to solve each scenario.
                <br />
                Each wrong answer removes <span className="font-semibold text-white">1 heart</span>.
                <br />
                <span className="font-semibold text-red-400">Lose all hearts = Game Over.</span>
              </p>
            </div>
          </div>

          {/* Right side: Instructions */}
          {/* OVERLAY UI CLEANUP — spacing & readability */}
          <div className="flex flex-col lg:w-1/2 gap-4 order-1 lg:order-2">
            <div className="text-gray-200 lilita-one-regular leading-snug text-xs sm:text-sm lg:text-base text-left space-y-2">
              <div>
                <p>
                  Module: <span className="text-yellow-400">Prompt Engineering</span>
                </p>
                <p className="mt-2">
                  Badge Earned:{" "}
                  <span className="text-green-400">🏆 Prompt Master</span>
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1 text-sm">Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                <motion.li
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  📖 Read the scenario in the green speech box
                </motion.li>
                <li>✍️ Write your User Prompt</li>
                <li>⚙️ Write your System Prompt</li>
                <li>✅ Click "Check Now" to evaluate</li>
                <li>💡 Use hints if needed (doesn't cost hearts!)</li>
                <li>🏅 Earn your Prompt Master badge!</li>
                </ul>
              </div>
            </div>

            {/* Tools Provided */}
            {/* OVERLAY UI CLEANUP — spacing & readability */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-[#FCB813] text-outline lilita-one-regular text-white font-semibold p-3 rounded-sm shadow-md text-xs sm:text-sm text-left leading-snug max-w-md"
            >
              <div className="uppercase text-sm sm:text-base mb-1">
                Tools Provided:
              </div>
              <div className="space-y-1">
                {tools.map((tool, idx) => (
                  <div key={idx}>{tool}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Start Button */}
        {/* OVERLAY UI CLEANUP — spacing & readability */}
        <div className="flex justify-center mt-3 sm:mt-4 pb-3 sm:pb-4 flex-shrink-0">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors lilita-one-regular text-lg"
          >
            Start Game
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructionOverlay;

