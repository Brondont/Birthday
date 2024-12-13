import React, { useState, useRef } from 'react';
import gyatDayAudio from "./audio/gyatDay.mp3";
import audioFart from "./audio/fart.mp3";
import Cake from "./components/Cake";
import './App.css';

// Main App Component
const App = () => {
  const [showCake, setShowCake] = useState(false);
  const audioPlayedRef = useRef(false); // Ref to track if audio has been played

  const handleStart = () => {
    setShowCake(true);

    // Play audio only if it hasn't been played yet
    if (!audioPlayedRef.current) {
      playGyatDay();
      audioPlayedRef.current = true; // Mark audio as played
    }
  };

  const playGyatDay = () => {
    const gyatAudio = new Audio(gyatDayAudio);
    gyatAudio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    gyatAudio.onended = () => {
      const fartAudio = new Audio(audioFart);
      fartAudio.play();
    }
  };

  return (
    <div className="text-center">
      <br />
      <button onClick={handleStart} id="start">Cake ?</button>
      <br />
      <br />
      {showCake && (
        <div id="cake-holder" style={{ opacity: 1 }}>
          <Cake />
        </div>
      )}
    </div>
  );
};

export default App;

