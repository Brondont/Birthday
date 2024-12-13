import React, { useState, useRef, useEffect } from "react";

const Cake = () => {
  const [candles, setCandles] = useState([]);
  const [extinguishedCandles, setExtinguishedCandles] = useState([]);
  const icingRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const [isEnd, setIsEnd] = useState(false);
  const [isEndEnd, setIsEndEnd] = useState(false);


  const handleClick = (e) => {
    if (!icingRef.current) return;
    const icingRect = icingRef.current.getBoundingClientRect();
    const clickX = e.clientX - icingRect.left + 10;
    const clickY = e.clientY - icingRect.top + 10;

    playImNew();

    setCandles(prevCandles =>
      [...prevCandles, { x: clickX, y: clickY }]
    );
  };

  const playImNew = () => {
    const imNewSound = new Audio("/sounds/imNewBro.mp3");
    imNewSound.play();
  }

  const playDigginInMe = () => {
    const inMeSound = new Audio("/sounds/youDigginInMe.mp3");
    inMeSound.play();
  }

  const startMicrophoneListening = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0
        }
      });
      micStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create an analyser node
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;

      // Create a media stream source
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Set up audio processing
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      const processAudio = () => {
        analyser.getFloatTimeDomainData(dataArray);

        // Calculate RMS (Root Mean Square) to measure sound intensity
        const rms = Math.sqrt(
          dataArray.reduce((sum, sample) => sum + sample * sample, 0) / dataArray.length
        );

        // Detect blowing (adjust threshold as needed)
        if (rms > 0.2) {
          blowOutCandle();
        }

        // Continue processing if microphone is still active
        if (micStreamRef.current) {
          requestAnimationFrame(processAudio);
        }
      };

      // Start audio processing
      processAudio();

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicrophoneListening = () => {
    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

  };


  const blowOutCandle = () => {
    // Get active candles that are not yet extinguished
    const activeCandles = candles.filter((_, index) => !extinguishedCandles.includes(index));

    if (activeCandles.length > 0) {
      const randomIndex = Math.floor(Math.random() * activeCandles.length);
      const selectedCandle = activeCandles[randomIndex];

      const selectedIndex = candles.indexOf(selectedCandle);

      // Use functional update to ensure we're working with the latest state
      setExtinguishedCandles((prevExtinguishedCandles) => {
        // Prevent duplicate extinguishing by checking if the candle is already extinguished
        if (!prevExtinguishedCandles.includes(selectedIndex)) {
          return [...prevExtinguishedCandles, selectedIndex];
        }
        return prevExtinguishedCandles;
      });
    }
  };


  useEffect(() => {
    startMicrophoneListening();

    if (!isEnd && candles.length > 0 && extinguishedCandles.length === candles.length) {
      playDigginInMe();
      setIsEnd(true);
      setIsEndEnd(true);
    } else {
      setIsEnd(false);
    }

    return () => {
      stopMicrophoneListening();
    }
  }, [candles, extinguishedCandles]);

  return (
    <>
      <div className="text-center">
        <h3 className="cake-off">❣ Happy Birthday Retarded ! ❣</h3>
        <p className="cake-off">🎶🍑🎂 Rizzy GyattDay to Mew… 🤫👈🎶 Pookie is literally 👌 in her 👩 Birthday 💐 Era… chat, can 👁️ we 👶👥 get a W? 💯🧚 HAPPY BIRTHDAY 🎁 😸🩵 the ultimate 💯 RIZZ Lord 👑 with the phattest Level 10 GYATT 🔛🔼 in the universe 💘😜🍀🧿 eight TEEN ‍♀️🫦never 🚫 looked 👀 so SIGMA 😩🐺. Let’s 👍 celebrATE 👅🥂 this GOON-MASTER with some 🐅 CAKE 🍑🍰🎂 don’t ⌛ forget 👋🏾 to BLOW 🍃 out 2️⃣4️⃣ 👴 candles so all 💯 your 👉 wishes 🙏 and CUM 💦💦 true. 🐵 Send 📩💌 this message 📝 to 🔟 other 👹 GAMERS 👦🎮 to send 📩📬📮 them dirty thoughts 🤔 birthday 💐 prayers and ROBUX 🙏🙏 </p>
        <h2>Candles Remaining: {candles.length - extinguishedCandles.length}</h2>
      </div>
      <div className="cake">
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div
          className="icing"
          ref={icingRef}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        ></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>

        {candles.map((candle, index) => (
          <div
            key={index}
            className="candle"
            style={{
              position: 'absolute',
              left: `${candle.x - 8}px`,
              top: `${candle.y - 50}px`,
              zIndex: 10,
              transition: 'opacity 0.5s ease'
            }}
          >
            {!extinguishedCandles.includes(index) && (
              <div className="flame"></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Cake;
