import React, { useState, useEffect, useRef } from 'react';

function Analyzer() {
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Welcome to Pulse AI Analyzer! Upload an ECG file or type a question, and I’ll help you analyze your heart health.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentGraph, setCurrentGraph] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false); // AI dialog loading
  const [isLoadingECG, setIsLoadingECG] = useState(false); // ECG card loading
  const [isCycling, setIsCycling] = useState(false); // Track if images are cycling
  const [activeSample, setActiveSample] = useState('SAMPLE1'); // Track the active sample
  const [graphs, setGraphs] = useState([]); // Store the images for the current sample

  const chatEndRef = useRef(null);

  // Define the images for each sample directly
  const sampleImages = {
    'SAMPLE1': [
      { title: "SAMPLE1 - ECG Step 1", src: "/SAMPLE1/ecg_step1.png", description: "SAMPLE1: Initial ECG signal processing step." },
      { title: "SAMPLE1 - ECG Step 2", src: "/SAMPLE1/ecg_step2.png", description: "SAMPLE1: Second step of ECG signal processing." },
      { title: "SAMPLE1 - ECG Step 3", src: "/SAMPLE1/ecg_step3.png", description: "SAMPLE1: Filtered ECG signal with detected R-peaks." },
      { title: "SAMPLE1 - ECG Step 4", src: "/SAMPLE1/ecg_step4.png", description: "SAMPLE1: Fourth step of ECG signal processing." },
      { title: "SAMPLE1 - ECG Final Enhanced", src: "/SAMPLE1/ecg_final_enhance.png", description: "SAMPLE1: Final enhanced ECG signal with all processing steps applied." }
    ],
    'SAMPLE2': [
      { title: "SAMPLE2 - ECG Step 1", src: "/SAMPLE2/ecg_step1.png", description: "SAMPLE2: Initial ECG signal processing step." },
      { title: "SAMPLE2 - ECG Step 2", src: "/SAMPLE2/ecg_step2.png", description: "SAMPLE2: Second step of ECG signal processing." },
      { title: "SAMPLE2 - ECG Step 3", src: "/SAMPLE2/ecg_step3.png", description: "SAMPLE2: Filtered ECG signal with detected R-peaks." },
      { title: "SAMPLE2 - ECG Step 4", src: "/SAMPLE2/ecg_step4.png", description: "SAMPLE2: Fourth step of ECG signal processing." },
      { title: "SAMPLE2 - ECG Final Enhanced", src: "/SAMPLE2/ecg_final_enhance.png", description: "SAMPLE2: Final enhanced ECG signal with all processing steps applied." }
    ],
    'SAMPLE3': [
      { title: "SAMPLE3 - ECG Step 1", src: "/SAMPLE3/ecg_step1.png", description: "SAMPLE3: Initial ECG signal processing step." },
      { title: "SAMPLE3 - ECG Step 2", src: "/SAMPLE3/ecg_step2.png", description: "SAMPLE3: Second step of ECG signal processing." },
      { title: "SAMPLE3 - ECG Step 3", src: "/SAMPLE3/ecg_step3.png", description: "SAMPLE3: Filtered ECG signal with detected R-peaks." },
      { title: "SAMPLE3 - ECG Step 4", src: "/SAMPLE3/ecg_step4.png", description: "SAMPLE3: Fourth step of ECG signal processing." },
      { title: "SAMPLE3 - ECG Final Enhanced", src: "/SAMPLE3/ecg_final_enhance.png", description: "SAMPLE3: Final enhanced ECG signal with all processing steps applied." }
    ]
  };

  // Load images directly from the public folder
  const fetchSampleImages = (sampleId) => {
    setIsLoadingECG(true);
    setImageError(false);

    // Simulate a small delay for smoothness
    setTimeout(() => {
      const images = sampleImages[sampleId] || [];
      setGraphs(images);
      setIsLoadingECG(false);
    }, 1000);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      setMessages([...messages, { sender: 'User', text: inputText }]);
      setIsLoadingAI(true);

      try {
        const response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: inputText,
            role: 'patient',
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessages((prev) => [...prev, { sender: 'AI', text: data.response }]);
        } else {
          setMessages((prev) => [...prev, { sender: 'AI', text: 'Error: Could not process your query.' }]);
        }
      } catch (error) {
        setMessages((prev) => [...prev, { sender: 'AI', text: 'Error: Failed to connect to the server.' }]);
      }

      setIsLoadingAI(false);
      setInputText('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([...messages, { sender: 'User', text: `Uploaded file: ${file.name}` }]);
      setIsLoadingAI(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('role', 'patient');

      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setMessages((prev) => [...prev, { sender: 'AI', text: data.response }]);
        } else {
          setMessages((prev) => [...prev, { sender: 'AI', text: 'Error: Could not process your file.' }]);
        }
      } catch (error) {
        setMessages((prev) => [...prev, { sender: 'AI', text: 'Error: Failed to connect to the server.' }]);
      }

      setIsLoadingAI(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSampleClick = (sampleId) => {
    if (activeSample === sampleId && graphs.length > 0) {
      setIsCycling(true);
      setIsLoadingECG(false);
      cycleImages();
      return;
    }

    setActiveSample(sampleId);
    setIsCycling(true);
    setIsLoadingECG(true);

    fetchSampleImages(sampleId);
  };

  const cycleImages = () => {
    let currentIndex = 0;

    const showNextImage = () => {
      if (currentIndex >= graphs.length || !isCycling) {
        setIsCycling(false);
        return;
      }

      setCurrentGraph(currentIndex);
      setTimeout(() => {
        currentIndex++;
        showNextImage();
      }, 2000); // Display each image for 2 seconds
    };

    showNextImage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load Sample 1 images by default on component mount
  useEffect(() => {
    handleSampleClick('SAMPLE1');
  }, []);

  const styles = `
    .message-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .css-particles {
      position: relative;
      width: 40px;
      height: 40px;
      overflow: visible;
    }

    .css-particles span {
      position: absolute;
      background: #F06292;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      animation: moveParticles 3s infinite ease-in-out;
      opacity: 0.6;
      box-shadow: 0 0 5px rgba(240, 98, 146, 0.5);
    }

    @keyframes moveParticles {
      0% {
        transform: translate(0, 0);
        opacity: 0.6;
      }
      50% {
        transform: translate(12px, 12px);
        opacity: 0.9;
      }
      100% {
        transform: translate(0, 0);
        opacity: 0.6;
      }
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .css-particles span:nth-child(1) { left: 5%; top: 5%; }
    .css-particles span:nth-child(2) { left: 15%; top: 25%; }
    .css-particles span:nth-child(3) { left: 25%; top: 45%; }
    .css-particles span:nth-child(4) { left: 35%; top: 65%; }
    .css-particles span:nth-child(5) { left: 45%; top: 15%; }
    .css-particles span:nth-child(6) { left: 55%; top: 35%; }
    .css-particles span:nth-child(7) { left: 65%; top: 55%; }
    .css-particles span:nth-child(8) { left: 75%; top: 75%; }
    .css-particles span:nth-child(9) { left: 85%; top: 25%; }
    .css-particles span:nth-child(10) { left: 95%; top: 45%; }
    .css-particles span:nth-child(11) { left: 10%; top: 80%; }
    .css-particles span:nth-child(12) { left: 20%; top: 60%; }
    .css-particles span:nth-child(13) { left: 30%; top: 40%; }
    .css-particles span:nth-child(14) { left: 40%; top: 20%; }
    .css-particles span:nth-child(15) { left: 50%; top: 70%; }
    .css-particles span:nth-child(16) { left: 60%; top: 50%; }
    .css-particles span:nth-child(17) { left: 70%; top: 30%; }
    .css-particles span:nth-child(18) { left: 80%; top: 10%; }
    .css-particles span:nth-child(19) { left: 90%; top: 60%; }
    .css-particles span:nth-child(20) { left: 95%; top: 80%; }
    .css-particles span:nth-child(21) { left: 12%; top: 55%; }
    .css-particles span:nth-child(22) { left: 22%; top: 35%; }
    .css-particles span:nth-child(23) { left: 32%; top: 75%; }
    .css-particles span:nth-child(24) { left: 42%; top: 45%; }
    .css-particles span:nth-child(25) { left: 52%; top: 65%; }
    .css-particles span:nth-child(26) { left: 62%; top: 25%; }
    .css-particles span:nth-child(27) { left: 72%; top: 85%; }
    .css-particles span:nth-child(28) { left: 82%; top: 15%; }
    .css-particles span:nth-child(29) { left: 92%; top: 55%; }
    .css-particles span:nth-child(30) { left: 98%; top: 30%; }

    .message-bubble {
      position: relative;
      max-width: 50%;
      padding: 12px 16px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.5;
      transition: all 0.3s ease;
      word-wrap: break-word;
    }

    .message-bubble.ai {
      background: linear-gradient(145deg, #f0f4ff, #e0e7ff);
      color: #1e3a8a;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .message-bubble.user {
      background: linear-gradient(145deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .message-bubble.ai::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 16px;
      width: 12px;
      height: 12px;
      background: #e0e7ff;
      border-radius: 50% 0 50% 50%;
      transform: rotate(45deg);
    }

    .message-bubble.user::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 16px;
      width: 12px;
      height: 12px;
      background: #2563eb;
      border-radius: 0 50% 50% 50%;
      transform: rotate(45deg);
    }

    .chat-container {
      background: linear-gradient(180deg, #e0f2fe, #f8fafc);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
      padding-bottom: 16px;
      max-height: calc(100% - 72px);
    }

    .main-container {
      display: flex;
      flex: 1;
      padding: 16px;
      gap: 16px;
      height: calc(100vh - 60px);
    }

    .chat-section {
      width: 66.67%;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .graph-section {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    /* Message Box Styles */
    .messageBox {
      width: 100%;
      max-width: 700px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e0e7ff;
      padding: 0 15px;
      border-radius: 10px;
      border: 1px solid #a3bffa;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .messageBox:focus-within {
      border: 1px solid #4f46e5;
    }

    .fileUploadWrapper {
      width: fit-content;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, Helvetica, sans-serif;
    }

    #file {
      display: none;
    }

    .fileUploadWrapper label {
      cursor: pointer;
      width: fit-content;
      height: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .fileUploadWrapper label svg {
      height: 18px;
    }

    .fileUploadWrapper label svg path {
      transition: all 0.3s;
    }

    .fileUploadWrapper label svg circle {
      transition: all 0.3s;
    }

    .fileUploadWrapper label:hover svg path {
      stroke: #1e3a8a;
    }

    .fileUploadWrapper label:hover svg circle {
      stroke: #1e3a8a;
      fill: #f0f4ff;
    }

    .fileUploadWrapper label:hover .tooltip {
      display: block;
      opacity: 1;
    }

    .tooltip {
      position: absolute;
      top: -40px;
      display: none;
      opacity: 0;
      color: #1e3a8a;
      font-size: 10px;
      white-space: nowrap;
      background-color: #ffffff;
      padding: 6px 10px;
      border: 1px solid #a3bffa;
      border-radius: 5px;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }

    #messageInput {
      width: 100%;
      height: 100%;
      background-color: transparent;
      outline: none;
      border: none;
      padding-left: 10px;
      color: #1e3a8a;
    }

    #messageInput:focus ~ #sendButton svg path,
    #messageInput:valid ~ #sendButton svg path {
      fill: #f0f4ff;
      stroke: #1e3a8a;
    }

    #sendButton {
      width: fit-content;
      height: 100%;
      background-color: transparent;
      outline: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    #sendButton svg {
      height: 18px;
      transition: all 0.3s;
    }

    #sendButton svg path {
      transition: all 0.3s;
    }

    #sendButton:hover svg path {
      fill: #f0f4ff;
      stroke: #1e3a8a;
    }

    /* AI Dialog Loader */
    .loader-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .dots-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 16px;
      width: auto;
    }

    .dot {
      height: 6px;
      width: 6px;
      margin-right: 4px;
      border-radius: 3px;
      background-color: #a3bffa;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .dot:last-child {
      margin-right: 0;
    }

    .dot:nth-child(1) {
      animation-delay: -0.3s;
    }

    .dot:nth-child(2) {
      animation-delay: -0.1s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.1s;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.8);
        background-color: #a3bffa;
        box-shadow: 0 0 0 0 rgba(163, 191, 250, 0.7);
      }

      50% {
        transform: scale(1.2);
        background-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(163, 191, 250, 0);
      }

      100% {
        transform: scale(0.8);
        background-color: #a3bffa;
        box-shadow: 0 0 0 0 rgba(163, 191, 250, 0.7);
      }
    }

    /* ECG Card Loader */
    .ecg-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .ecg-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e7ff;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Arrow Buttons for Prev/Next */
    .arrow-button {
      background: linear-gradient(145deg, #e0e7ff, #f0f4ff);
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .arrow-button:hover {
      background: linear-gradient(145deg, #d1e0ff, #c7d4ff);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .arrow-button svg {
      width: 20px;
      height: 20px;
      color: #1e3a8a;
    }

    /* Centering the Message Bar */
    .input-section {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    /* Sample Buttons */
    .graph-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .sample-buttons {
      display: flex;
      gap: 6px;
    }

    .sample-button {
      background: linear-gradient(145deg, #e0e7ff, #f0f4ff);
      color: #1e3a8a;
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .sample-button:hover {
      background: linear-gradient(145deg, #d1e0ff, #c7d4ff);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .sample-button.active {
      background: linear-gradient(145deg, #a3bffa, #818cf8);
      color: white;
    }
  `;

  return (
    <div className="flex-1 flex flex-col h-screen bg-blue-100 pt-15 pl-15">
      <style>{styles}</style>
      {/* Main Content */}
      <div className="main-container">
        {/* Left Side: Chatbot (Larger) */}
        <div className="chat-section">
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-container ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'User' ? (
                    <span className="message-bubble user">
                      {msg.text}
                    </span>
                  ) : (
                    <>
                      <div className="css-particles">
                        {[...Array(30)].map((_, i) => (
                          <span key={i} style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                      <span className="message-bubble ai">
                        {msg.text}
                      </span>
                    </>
                  )}
                </div>
              ))}
              {isLoadingAI && (
                <div className="loader-container justify-start">
                  <div className="css-particles">
                    {[...Array(30)].map((_, i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <section className="dots-container">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </section>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input Section */}
            <div className="mt-4 input-section">
              <div className="messageBox">
                <div className="fileUploadWrapper">
                  <label htmlFor="file">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                      <circle
                        strokeWidth="20"
                        stroke="#6c6c6c"
                        fill="none"
                        r="158.5"
                        cy="168.5"
                        cx="168.5"
                      ></circle>
                      <path
                        strokeLinecap="round"
                        strokeWidth="25"
                        stroke="#6c6c6c"
                        d="M167.759 79V259"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeWidth="25"
                        stroke="#6c6c6c"
                        d="M79 167.138H259"
                      ></path>
                    </svg>
                    <span className="tooltip">Add an image</span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileUpload}
                  />
                </div>
                <input
                  required=""
                  placeholder="Type your prompt here."
                  type="text"
                  id="messageInput"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button id="sendButton" onClick={handleSend} title="Send message">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                    <path
                      fill="none"
                      d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                    ></path>
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="33.67"
                      stroke="#6c6c6c"
                      d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Graphs (Smaller) */}
        <div className="graph-section">
          {/* Carousel for Graphs */}
          <div className="bg-white rounded-lg p-4 shadow h-3/4 relative">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {graphs.length > 0 ? graphs[currentGraph].title : 'Loading...'}
            </h2>
            <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center overflow-hidden relative">
              {isLoadingECG && (
                <div className="ecg-loading-overlay">
                  <div className="ecg-spinner"></div>
                </div>
              )}
              {imageError || graphs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-full text-center">
                  <svg
                    className="w-1/2 h-8 mb-2"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points="0,10 20,10 25,5 30,15 35,10 50,10 55,5 60,15 65,10 80,10 85,5 90,15 100,10"
                      fill="none"
                      stroke="#A0A0A0"
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                  </svg>
                  <p className="text-gray-600 text-sm font-medium">No ECG Data Available</p>
                </div>
              ) : (
                <img
                  src={graphs[currentGraph].src}
                  alt={graphs[currentGraph].title}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={openModal}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 graph-controls">
              <button
                onClick={() => {
                  setCurrentGraph((prev) => (prev === 0 ? graphs.length - 1 : prev - 1));
                  setImageError(false);
                  setIsCycling(false); // Stop auto-cycling when manually navigating
                }}
                className="arrow-button"
                title="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="sample-buttons">
                <button
                  className={`sample-button ${activeSample === 'SAMPLE1' ? 'active' : ''}`}
                  onClick={() => handleSampleClick('SAMPLE1')}
                  title="View Sample 1"
                >
                  Sample 1
                </button>
                <button
                  className={`sample-button ${activeSample === 'SAMPLE2' ? 'active' : ''}`}
                  onClick={() => handleSampleClick('SAMPLE2')}
                  title="View Sample 2"
                >
                  Sample 2
                </button>
                <button
                  className={`sample-button ${activeSample === 'SAMPLE3' ? 'active' : ''}`}
                  onClick={() => handleSampleClick('SAMPLE3')}
                  title="View Sample 3"
                >
                  Sample 3
                </button>
              </div>
              <button
                onClick={() => {
                  setCurrentGraph((prev) => (prev === graphs.length - 1 ? 0 : prev + 1));
                  setImageError(false);
                  setIsCycling(false); // Stop auto-cycling when manually navigating
                }}
                className="arrow-button"
                title="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Graph Description */}
          <div className="bg-white rounded-lg p-4 shadow h-1/4">
            <h3 className="text-md font-semibold text-blue-700">Description</h3>
            <p className="text-gray-600 mt-2">
              {graphs.length > 0 ? graphs[currentGraph].description : 'No description available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Full-Size Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600"
              title="Close modal"
            >
              ✕
            </button>
            {imageError || graphs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[80vh] w-full max-w-4xl text-center">
                <svg
                  className="w-1/2 h-12 mb-4"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points="0,10 20,10 25,5 30,15 35,10 50,10 55,5 60,15 65,10 80,10 85,5 90,15 100,10"
                    fill="none"
                    stroke="#A0A0A0"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                </svg>
                <p className="text-gray-600 text-lg font-medium">No ECG Data Available</p>
              </div>
            ) : (
              <img
                src={graphs[currentGraph].src}
                alt={graphs[currentGraph].title}
                className="max-w-full max-h-[80vh] object-contain"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analyzer;