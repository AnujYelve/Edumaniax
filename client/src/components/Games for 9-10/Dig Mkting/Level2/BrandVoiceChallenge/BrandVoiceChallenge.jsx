import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDM } from "@/contexts/DMContext";
import { usePerformance } from "@/contexts/PerformanceContext"; //for performance

const APIKEY = import.meta.env.VITE_API_KEY;

const scenarios = [
    {
        id: "insta",
        platform: "Instagram DM",
        question: "Hey! Can I use the cleanser if I have acne-prone skin?",
    },
    {
        id: "reel",
        platform: "Comment on Reel",
        question: "This ad is annoying!",
    },
    {
        id: "whatsapp",
        platform: "WhatsApp query",
        question: "Love the look! Where can I buy this?",
    },
];

const BrandVoiceChallenge = () => {
    const { completeDMChallenge } = useDM();
    const getInitialState = () => ({
        selectedPlatform: null,
        responses: {},
        submitted: false,
        result: null,
        step: 1,
        caption: "",
        vibe: "",
        captionScore: null,
        finalStep: false,
    });
    //for performance
    const { updatePerformance } = usePerformance();
   const [startTime,setStartTime] = useState(Date.now());

    const [state, setState] = useState(getInitialState());

    // Destructure state for easier access
    const {
        selectedPlatform,
        responses,
        submitted,
        result,
        step,
        caption,
        vibe,
        captionScore,
        finalStep,
    } = state;

    // Calculate passing threshold for the final 11-point score (e.g., 70% of 11 = 7.7, rounded to 8 for simplicity).
    const finalPassingScore = 8; // Out of 11

    // Passing threshold for the first task (response writing out of 8 points)
    const firstTaskPassingScore = 5; // Example: 5 out of 8 for Chat Responses (3) + Tone Match (5)

    useEffect(() => {
        if (finalStep && result?.finalBreakdown?.overallTotal >= finalPassingScore) {
            completeDMChallenge(1, 2);
        }
    }, [finalStep, result, finalPassingScore, completeDMChallenge]);

    /**
     * Resets all game states to their initial values.
     */
    const resetGame = () => {
        setState(getInitialState());
        setStartTime(Date.now());

    };

    /**
     * Updates the user's response for a specific scenario.
     * @param {string} id - The ID of the scenario.
     * @param {string} value - The new response text.
     */
    const handleResponseChange = (id, value) => {
        setState((prevState) => ({
            ...prevState,
            responses: { ...prevState.responses, [id]: value },
        }));
    };



    const extractJSON = (str) => {
        const match = str.match(/{[\s\S]*?}/);
        if (!match) {
            console.error("❌ No JSON found in response:", str);
            return null;
        }

        try {
            return JSON.parse(match[0]);
        } catch (err) {
            console.error("❌ JSON parsing error:", err.message);
            console.error("🔎 Problematic JSON string:", match[0]);
            return null;
        }
    };


    const handleSubmit = async () => {
        const platformScores = {};
        setState(prev => ({ ...prev, submitted: true }));

        for (let s of scenarios) {
            const userReply = responses[s.id];

            const prompt = `
You are an evaluator for a skincare brand called GlowPop.

Platform: ${s.platform}
User Message: "${s.question}"
Student's Response: "${userReply}"

Your job is to give a strict JSON score based on:
- Tone Accuracy (2 pts): Friendly, respectful, on-brand?
- Addressed Need (2 pts): Did it answer or help?
- Platform Fit (1 pt): Right tone and length for platform?

⚠️ Only return **valid JSON**, with integers only (no text like "2/2", no explanations in keys/values).

✅ Format your answer EXACTLY like this (with numbers only):

{
  "tone": 2,
  "need": 2,
  "fit": 1,
  "feedback": "Great tone and helpful response."
}

ONLY output the JSON. Nothing else.
`;

            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`,
                    {
                        contents: [{ parts: [{ text: prompt }] }],
                    }
                );

                const aiReply =
                    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

                const parsed = extractJSON(aiReply) || {
                    tone: 0,
                    need: 0,
                    fit: 0,
                    feedback: "Invalid JSON from Gemini.",
                };

                platformScores[s.id] = parsed;
            } catch (error) {
                console.error(`❌ Error scoring response for ${s.platform}:`, error);
                platformScores[s.id] = {
                    tone: 0,
                    need: 0,
                    fit: 0,
                    feedback: "Error calling Gemini API.",
                };
            }
        }

        // Calculate raw totals from AI for scaling
        const totalNeedsRaw = Object.values(platformScores).reduce((sum, r) => sum + (r?.need || 0), 0); // Max 2 * 3 = 6
        const totalTonesRaw = Object.values(platformScores).reduce((sum, r) => sum + (r?.tone || 0), 0); // Max 2 * 3 = 6
        const totalFitsRaw = Object.values(platformScores).reduce((sum, r) => sum + (r?.fit || 0), 0);   // Max 1 * 3 = 3

        // Calculate scaled scores for the first part (Chat Responses & Tone Match)
        // Chat Responses: 3 points (based on 'need' from platforms, max 6 raw points)
        const chatResponsesPoints = (totalNeedsRaw / 6) * 3;
        // Tone Match Across Platforms: 5 points (based on 'tone' + 'fit' from platforms, max (6+3)=9 raw points)
        const toneMatchAcrossPlatformsPoints = ((totalTonesRaw + totalFitsRaw) / 9) * 5;

        // Store scores including the scaled ones for display in Step 2
        setState(prev => ({
            ...prev,
            result: {
                scores: platformScores,
                chatResponsesPoints: chatResponsesPoints,
                toneMatchAcrossPlatformsPoints: toneMatchAcrossPlatformsPoints,
                totalRawPlatformScore: (totalNeedsRaw + totalTonesRaw + totalFitsRaw) // For raw 15-point display in summary
            },
            submitted: false, // Reset submitted state after evaluation
            step: 2 // Move to the evaluation summary for platform responses
        }));
    };


    const handleCaptionScore = async () => {
        const captionPrompt = `
You are an Instagram content coach.
GlowPop just launched eco-packaging. The student wrote this caption:

"${caption}"

Evaluate it for:
- Creativity (2 pts): Is it catchy and fun?
- Brand Voice Match (2 pts): Does it sound like GlowPop?
- Call to Action (1 pt): Is there a nudge to act?

Return strict JSON like:
{
  "creativity": 2,
  "voice": 2,
  "cta": 1,
  "feedback": "Playful and very on-brand. Nice CTA."
}

ONLY return the JSON.
`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`,
                {
                    // CORRECTED: Ensure 'captionPrompt' is used here instead of an undefined 'prompt'
                    contents: [{ parts: [{ text: captionPrompt }] }],
                }
            );
            const aiReply =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            const parsedCaptionScore = extractJSON(aiReply) || {
                creativity: 0,
                voice: 0,
                cta: 0,
                feedback: "Invalid JSON from Gemini.",
            };
            setState(prev => ({ ...prev, captionScore: parsedCaptionScore })); // Store raw caption score

            // --- Calculate final overall score based on user's new rules ---
            const rawCaptionTotal = (parsedCaptionScore?.creativity || 0) + (parsedCaptionScore?.voice || 0) + (parsedCaptionScore?.cta || 0); // Max 5

            // Caption Writing: 3 points (based on raw caption score, max 5 raw points)
            const captionWritingPoints = (rawCaptionTotal / 5) * 3;

            // Combine with previously calculated platform scores
            const overallFinalCalculatedTotal =
                (result?.chatResponsesPoints || 0) +
                (result?.toneMatchAcrossPlatformsPoints || 0) +
                captionWritingPoints;

            // Update result state with the new final breakdown for display
            setState(prev => ({
                ...prev,
                result: {
                    ...prev.result,
                    finalBreakdown: {
                        chatResponses: (prev.result?.chatResponsesPoints || 0),
                        toneMatchAcrossPlatforms: (prev.result?.toneMatchAcrossPlatformsPoints || 0),
                        captionWriting: captionWritingPoints,
                        overallTotal: overallFinalCalculatedTotal
                    }
                },
                finalStep: true // Show the final score section
            }));

            // ⏱️ Track performance and update DB
            const endTime = Date.now();
            const durationSec = Math.round((endTime - startTime) / 1000);
            const durationMinutes = Math.round(durationSec / 60) || 1;

            const totalPoints = overallFinalCalculatedTotal; // max = 11
            const scoreOutOf10 = Math.round((totalPoints / 11) * 10);
            const accuracyOutOf100 = Math.round((totalPoints / 11) * 100);
            const avgResponseTimeSec = Math.round(durationSec); // per point

            updatePerformance({
                moduleName: "DigitalMarketing",
                topicName: "creativity",
                score: scoreOutOf10,
                accuracy: accuracyOutOf100,
                avgResponseTimeSec,
                studyTimeMinutes: durationMinutes,
                completed: true,
              
            });
            setStartTime(Date.now());



        } catch (err) {
            console.error("❌ Error scoring caption:", err);
            // Set scores to 0 in case of API failure for a graceful display
            setState(prev => ({
                ...prev,
                captionScore: {
                    creativity: 0,
                    voice: 0,
                    cta: 0,
                    feedback: "Failed to fetch score.",
                },
                result: {
                    ...prev.result,
                    finalBreakdown: {
                        chatResponses: (prev.result?.chatResponsesPoints || 0),
                        toneMatchAcrossPlatforms: (prev.result?.toneMatchAcrossPlatformsPoints || 0),
                        captionWriting: 0, // Set to 0 if API fails
                        overallTotal: (prev.result?.chatResponsesPoints || 0) + (prev.result?.toneMatchAcrossPlatformsPoints || 0) // Only previous scores
                    }
                },
                finalStep: true // Still show final step even if API fails
            }));
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-3xl mb-3 mt-3 mx-auto bg-gradient-to-br from-pink-50 to-yellow-100 rounded-3xl border-4 border-purple-200 shadow-2xl animate-fade-in">
            <motion.h1
                initial={{ opacity: 0, y: 0 }}
                animate={{
                    opacity: 1,
                    y: [0, -8, 0], // bounce up and down
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
                className="text-4xl font-extrabold text-center text-purple-800 flex items-center justify-center gap-2"
            >
                🤖💬 <span className="animate-pulse">Brand Voice Chat Sim</span> 🎯
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center text-lg text-gray-700 italic px-2"
            >
                💥 “GlowPop’s chatbot is down... can <span className="text-pink-600 font-semibold">you</span> handle the tone like a real brand hero?” 💪
            </motion.p>

            <div className="text-center">
                <p className="text-sm text-pink-600 font-medium bg-white inline-block px-4 py-2 rounded-full shadow-md border-2 border-pink-200">
                    Mission: Keep the brand vibe alive! ✨
                </p>
            </div>


            {/* Step 1: Platform Selection and Response Input */}
            {step === 1 && (
                <>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl font-extrabold text-center text-pink-600 mb-4"
                    >
                        🎮 Brand Voice Challenge – Step 1<br />
                        <span className="text-sm text-purple-500">Tap a message to craft your reply 💬</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        {scenarios.map((s) => (
                            <motion.div
                                key={s.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setState(prev => ({ ...prev, selectedPlatform: s.id }))}
                                className={`cursor-pointer rounded-2xl border-4 p-5 transition-all duration-300 text-center shadow-lg ${selectedPlatform === s.id
                                    ? "border-yellow-400 bg-yellow-50"
                                    : "border-pink-300 bg-white"
                                    } hover:shadow-pink-300`}
                            >
                                <div className="text-4xl mb-2">
                                    {s.id === "insta" && "📩"}
                                    {s.id === "reel" && "🎥"}
                                    {s.id === "whatsapp" && "💬"}
                                </div>
                                <h2 className="text-lg font-bold text-pink-600">{s.platform}</h2>
                                <p className="text-xs text-gray-600 mt-1 italic">Click to respond ✨</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {selectedPlatform && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6 bg-gradient-to-br from-pink-50 to-white rounded-2xl border-4 border-purple-200 p-6 shadow-xl"
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-purple-700 mb-2">
                                ✍️ Your Mission: Respond to a {scenarios.find((s) => s.id === selectedPlatform)?.platform}
                            </h3>
                            <p className="text-lg font-semibold text-gray-800 mb-4">
                                🗯️ "{scenarios.find((s) => s.id === selectedPlatform)?.question}"
                            </p>
                            <textarea
                                rows={4}
                                className="w-full border-2 border-pink-300 rounded-xl p-4 text-sm shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="💬 Type your friendly, helpful reply here!"
                                value={responses[selectedPlatform] || ""}
                                onChange={(e) =>
                                    handleResponseChange(selectedPlatform, e.target.value)
                                }
                            />
                        </motion.div>
                    )}

                    <div className="text-center mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={Object.keys(responses).length < scenarios.length}
                        >
                            🚀 Submit All Responses
                        </motion.button>

                        {submitted && (
                            <p className="text-green-600 font-semibold mt-3 animate-bounce">
                                ✅ Responses submitted! Evaluating tone… 🎯
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Step 2: AI Evaluation Summary for Platform Responses (Chat Responses + Tone Match) */}
            {step === 2 && result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mt-6 bg-gradient-to-br from-green-50 to-white border-4 border-green-200 rounded-3xl p-6 shadow-xl"
                >
                    <h3 className="text-2xl font-extrabold text-green-700 mb-4 text-center">
                        🧠✨ Response Writing Score!
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {scenarios.map((s) => {
                            const score = result.scores?.[s.id] || {};
                            const icon =
                                s.id === "insta" ? "📩" : s.id === "reel" ? "🎥" : s.id === "whatsapp" ? "💬" : "💡";

                            return (
                                <motion.div
                                    key={s.id}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white rounded-xl border-2 border-green-300 p-4 shadow-md"
                                >
                                    <div className="text-4xl mb-2 text-center">{icon}</div>
                                    <h4 className="text-md font-bold text-green-800 text-center">{s.platform}</h4>
                                    <div className="flex justify-around mt-2 text-sm text-purple-700 font-semibold">
                                        <div className="flex flex-col items-center">
                                            ⭐<span className="text-xs">Tone</span>
                                            <span>{score.tone ?? 0}/2</span> {/* Corrected max points here */}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            🎯<span className="text-xs">Need</span>
                                            <span>{score.need ?? 0}/2</span> {/* Corrected max points here */}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            📱<span className="text-xs">Fit</span>
                                            <span>{score.fit ?? 0}/1</span> {/* Corrected max points here */}
                                        </div>
                                    </div>
                                    <div className="mt-3 p-2 text-xs text-gray-600 italic border-l-4 border-green-400 bg-green-50 rounded-lg">
                                        “{score.feedback}”
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-lg font-bold text-green-800">
                            🗣️ <span className="text-purple-700">Tone Match Across Platforms:</span> {(result.toneMatchAcrossPlatformsPoints || 0).toFixed(1)} / 5 points
                        </p>
                        <p className="text-lg font-bold text-green-800 mt-1">
                            💬 <span className="text-pink-600">Chat Responses:</span> {(result.chatResponsesPoints || 0).toFixed(1)} / 3 points
                        </p>
                        <p className="text-xl font-extrabold text-green-800 mt-3">
                            Overall Response Score: {((result.toneMatchAcrossPlatformsPoints || 0) + (result.chatResponsesPoints || 0)).toFixed(1)} / 8 points
                        </p>

                        <div className="relative w-64 mx-auto h-4 mt-4 rounded-full bg-green-200 overflow-hidden">
                            <motion.div
                                className="h-full bg-pink-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(((result.toneMatchAcrossPlatformsPoints || 0) + (result.chatResponsesPoints || 0)) / 8) * 100}%` }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                            ></motion.div>
                        </div>

                        {((result.toneMatchAcrossPlatformsPoints || 0) + (result.chatResponsesPoints || 0)) >= firstTaskPassingScore ? (
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: [-2, 2, -2, 0] }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 px-8 py-3 bg-pink-500 text-white font-bold text-md rounded-full shadow-lg hover:bg-pink-600 transition"
                                onClick={() => setState(prev => ({ ...prev, step: 3 }))}
                            >
                                ✅ Great Job! Continue to Caption Challenge 🚀
                            </motion.button>
                        ) : (
                            <>
                                <p className="text-red-500 font-semibold mt-4">
                                    ❌ Oops! You need at least {firstTaskPassingScore} to continue. Try again! 💪
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-4 px-6 py-2 rounded-full bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700 transition"
                                    onClick={resetGame} // Call the resetGame function here
                                >
                                    🔄 Try Again
                                </motion.button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}


            {/* Step 3: Auto-Caption Generator and Raw Caption Score Display */}
            {step === 3 && (
                <motion.div
                    className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-3xl shadow-xl border-4 border-purple-200 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-extrabold text-center text-purple-700 flex justify-center items-center gap-2">
                        🧠 Step 3: <span className="text-pink-600 animate-pulse">Auto-Caption Generator</span>
                    </h2>
                    <p className="text-center text-md text-gray-600 italic mb-2">
                        “🌿 GlowPop’s eco-packaging is now live! Create a catchy Insta caption to announce it.”
                    </p>

                    {/* Vibe Selector */}
                    <div className="flex gap-3 justify-center mb-4">
                        {[
                            { label: "Trendy", icon: "🔥" },
                            { label: "Eco-Friendly", icon: "🌱" },
                            { label: "Educational", icon: "📘" },
                        ].map((v) => (
                            <motion.button
                                key={v.label}
                                onClick={() => setState(prev => ({ ...prev, vibe: v.label }))}
                                whileTap={{ scale: 0.9 }}
                                className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition shadow-sm flex items-center gap-2 ${vibe === v.label
                                    ? "bg-pink-200 border-pink-500 text-pink-700 shadow-lg"
                                    : "bg-white border-gray-300 text-gray-600"
                                    }`}
                            >
                                {v.icon} {v.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Caption Input */}
                    <textarea
                        className="w-full border-2 border-purple-300 p-4 rounded-xl text-sm shadow-inner bg-white placeholder:text-gray-400"
                        rows={3}
                        placeholder="📲 Write your short caption here…"
                        value={caption}
                        onChange={(e) => setState(prev => ({ ...prev, caption: e.target.value }))}
                    />

                    {/* Instagram Preview */}
                    {/* Instagram Preview */}
                    <div className="border-t pt-4">
                        <h4 className="font-extrabold text-lg mb-2 text-purple-700 flex items-center gap-2">
                            📸 Insta Preview
                        </h4>
                        <div className="border-2 border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
                            <div className="relative h-40 bg-gradient-to-tr from-yellow-100 via-pink-200 to-purple-300 rounded-xl p-4 text-center flex flex-col justify-center items-center text-gray-800">
                                {/* Animated Emojis */}
                                <motion.div className="absolute text-2xl left-4 top-3" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>✨</motion.div>
                                <motion.div className="absolute text-2xl right-6 bottom-2" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>😍</motion.div>

                                {/* Caption Text on Top */}
                                <p className="text-pink-600 font-bold text-md z-10">✨ GlowPop ✨</p>
                                <p className="text-md font-medium mt-2 z-10">
                                    {caption || "Your caption will appear here…"}
                                </p>
                            </div>
                        </div>
                    </div>



                    {/* Score Button */}
                    <div className="text-center">
                        <motion.button
                            onClick={handleCaptionScore}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-4 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700"
                        >
                            🧪 Score My Caption!
                        </motion.button>

                        {/* Raw Caption Score Display */}
                        {captionScore && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                className="mt-6 bg-green-50 p-5 rounded-2xl border-4 border-green-200 text-left text-sm shadow-md space-y-2"
                            >
                                <div className="flex items-center gap-3 text-green-800 font-bold text-md">
                                    🌟 Your Scores
                                </div>
                                <p>🎨 <strong>Creativity:</strong> {captionScore.creativity}/2</p>
                                <p>🎤 <strong>Brand Voice Match:</strong> {captionScore.voice}/2</p>
                                <p>📢 <strong>Call to Action:</strong> {captionScore.cta}/1</p>

                                <div className="mt-2 italic text-gray-600">
                                    “{captionScore.feedback}”
                                </div>

                                <div className="mt-2 font-bold text-green-700 text-lg">
                                    ✅ Total Caption Score:{" "}
                                    {(captionScore.creativity || 0) +
                                        (captionScore.voice || 0) +
                                        (captionScore.cta || 0)}
                                    /5
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}


            {/* Final Step: Consolidated Score Display */}
            {finalStep && result?.finalBreakdown && (
                <motion.div
                    className="bg-gradient-to-br from-yellow-100 to-white p-6 rounded-3xl shadow-2xl border-4 border-yellow-300 mt-6 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-extrabold text-center text-yellow-600 flex justify-center items-center gap-2">
                        🏁 Final Challenge Result
                    </h2>

                    {/* Score Breakdown with Emojis */}
                    <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-yellow-200 space-y-3 text-md text-gray-800 font-semibold text-center">
                        <p>🗣️ <span className="text-purple-700">Tone Match Across Platforms:</span> <strong>{(result.finalBreakdown.toneMatchAcrossPlatforms || 0).toFixed(1)}</strong> / 5 ⭐</p>
                        <p>💬 <span className="text-pink-600">Chat Responses:</span> <strong>{(result.finalBreakdown.chatResponses || 0).toFixed(1)}</strong> / 3 💬</p>
                        <p>✍️ <span className="text-indigo-600">Caption Writing:</span> <strong>{(result.finalBreakdown.captionWriting || 0).toFixed(1)}</strong> / 3 📝</p>
                    </div>

                    {/* Total Score */}
                    <div className="text-center text-2xl font-extrabold text-green-700 mt-2">
                        🌟 Total Points: {(result.finalBreakdown.overallTotal || 0).toFixed(1)} / 11
                    </div>

                    {/* Outcome Badge */}
                    {(result.finalBreakdown.overallTotal || 0) >= finalPassingScore ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center bg-green-100 border-2 border-green-300 p-4 rounded-xl text-lg font-bold text-green-700 shadow-md"
                        >
                            🏆 <span className="text-purple-800 text-xl">Congrats!</span> You're a <span className="underline decoration-pink-400">Brand Voice Champion</span>!
                            <div className="mt-2 text-3xl animate-bounce">🎖️</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center bg-red-100 border-2 border-red-300 p-4 rounded-xl text-md font-bold text-red-600 shadow-sm"
                        >
                            ❌ Oops! You scored below {finalPassingScore}.
                            <div className="mt-1">But don't worry—practice makes perfect! 💪</div>
                            <div className="mt-2 text-2xl animate-pulse">🔄</div>
                        </motion.div>
                    )}

                    {/* Restart Button */}
                    <div className="text-center mt-4">
                        <button
                            onClick={resetGame} // Call the resetGame function here
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg transition transform hover:scale-105"
                        >
                            🔁 Restart Challenge
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BrandVoiceChallenge;