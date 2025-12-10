import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  
  // Load initial state from localStorage, default to true (playing)
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem("gameMusicPlaying");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gameMusicPlaying", JSON.stringify(isPlaying));
  }, [isPlaying]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/financeGames6to8/bgMusic.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play/pause based on isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    const playAudio = async () => {
      try {
        if (isPlaying) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } catch (err) {
        console.warn("Audio play failed:", err);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [isPlaying]);

  const toggleAudio = async () => {
    setIsPlaying((prev) => !prev);
  };

  const playAudio = () => {
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        toggleAudio,
        playAudio,
        pauseAudio,
        audioRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

