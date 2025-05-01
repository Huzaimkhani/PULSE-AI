import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const styles = `
  /* Glass effect for containers and cards */
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  /* Motion gradient background (white and blue) */
  .gradient-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #FFFFFF, #E3F2FD, #BBDEFB, #90CAF9);
    background-size: 400%;
    animation: gradientAnimation 15s ease infinite;
    z-index: -1;
  }

  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Container for the entire page */
  .doctor-chat-container {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    height: calc(100vh - 5rem); /* Adjust for header/footer if present */
    overflow: hidden; /* Prevent container scrolling issues */
  }

  /* Doctors list container */
  .doctors-list {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto; /* Allow scrolling within the list */
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.9); /* Soft white background for Available Doctors container */
    border-radius: 15px;
  }

  /* Individual doctor card */
  .doctor-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: pointer;
  }

  .doctor-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .doctor-icon {
    font-size: 20px;
    line-height: 20px;
  }

  .doctor-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #e0e0e0;
  }

  .doctor-details {
    font-size: 0.9rem;
    color: #666;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .tag {
    background: #E3F2FD;
    color: #1E88E5;
    padding: 0.3rem 0.6rem;
    border-radius: 10px;
    font-size: 0.8rem;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .view-details-btn {
    background: #1E88E5;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
  }

  .make-appointment-btn {
    background: transparent;
    border: 1px solid #1E88E5;
    color: #1E88E5;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
  }

  /* Chat container */
  .chat-container {
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: transparent; /* Transparent background for chat */
  }

  .chat-header {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1E88E5;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(45deg, #FFFFFF, #E3F2FD, #BBDEFB, #90CAF9); /* Match the background theme */
    background-size: 400%;
    animation: gradientAnimation 15s ease infinite;
    border-radius: 10px;
  }

  .message {
    max-width: 60%;
    padding: 0.8rem 1rem;
    border-radius: 15px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .message-sent {
    background: linear-gradient(145deg, #1E88E5, #1565C0);
    color: white;
    align-self: flex-end;
  }

  .message-received {
    background: linear-gradient(145deg, #E3F2FD, #BBDEFB);
    color: #333;
    align-self: flex-start;
  }

  .message-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #e0e0e0;
  }

  .message-content {
    flex: 1;
  }

  .message-time {
    font-size: 0.7rem;
    color: #999;
    margin-top: 0.3rem;
    text-align: right;
  }

  .chat-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
  }

  .chat-input-field {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #333;
  }

  .send-btn {
    background: #1E88E5;
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-icon {
    width: 20px;
    height: 20px;
  }

  .error-boundary {
    padding: 2rem;
    text-align: center;
    color: #ff4444;
  }
`;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in DoctorChat:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}

function DoctorChat() {
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Zainab");
  const [messages, setMessages] = useState({
    "Dr. Hamza": [
      { text: "Hi Dr. Hamza", sender: "user", time: "1:25:38 AM" },
      { text: "Hello! How can I assist you today?", sender: "doctor", time: "1:25:39 AM" },
      { text: "I have chest pain", sender: "user", time: "1:25:50 AM" },
      { text: "Can you describe the pain? Is it sharp or dull?", sender: "doctor", time: "1:25:51 AM" },
    ],
    "Dr. Zainab": [
      { text: "hi dr zainab", sender: "user", time: "1:25:38 AM" },
      { text: "Hello! How can I assist you today?", sender: "doctor", time: "1:25:39 AM" },
      { text: "how are you doing today", sender: "user", time: "1:25:50 AM" },
      { text: "I'm doing well, thank you! How about you?", sender: "doctor", time: "1:25:51 AM" },
    ],
    "Dr. Azqa": [
      { text: "Hi Dr. Azqa", sender: "user", time: "1:25:38 AM" },
      { text: "Hello! How can I assist you today?", sender: "doctor", time: "1:25:39 AM" },
      { text: "I feel dizzy", sender: "user", time: "1:25:50 AM" },
      { text: "Have you experienced this before? Any recent changes in your diet or sleep?", sender: "doctor", time: "1:25:51 AM" },
    ],
  });

  const [newMessage, setNewMessage] = useState("");
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, selectedDoctor]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMessages((prev) => ({
      ...prev,
      [selectedDoctor]: [
        ...(prev[selectedDoctor] || []),
        { text: newMessage, sender: "user", time: currentTime },
      ],
    }));
    setNewMessage("");

    // Simulate a doctor reply (for demo purposes)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessages((prev) => ({
        ...prev,
        [selectedDoctor]: [
          ...(prev[selectedDoctor] || []),
          { text: "I'm here to help! Can you provide more details?", sender: "doctor", time: replyTime },
        ],
      }));
    }, 1000);
  };

  const doctors = [
    {
      name: "Dr. Hamza",
      specialty: "Cardiologist",
      location: "New York, USA",
      phone: "+123 456 7890",
      email: "hamza.johnson@willebordses.com",
      tags: ["New Client", "Online Therapy"],
      genderIcon: "♂",
    },
    {
      name: "Dr. Zainab",
      specialty: "General Physician",
      location: "New York, USA",
      phone: "+123 456 7891",
      email: "zainab.lee@willebordses.com",
      tags: ["New Client", "Online Therapy"],
      genderIcon: "♀",
    },
    {
      name: "Dr. Azqa",
      specialty: "Cardiologist",
      location: "New York, USA",
      phone: "+123 456 7892",
      email: "azqa.davis@willebordses.com",
      tags: ["New Client", "Online Therapy"],
      genderIcon: "♀",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative">
        <div className="gradient-background" />
        <div className="doctor-chat-container">
          <style>{styles}</style>

          {/* Doctors List */}
          <motion.div
            className="doctors-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Available Doctors</h2>
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                className="doctor-card glass-effect"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setSelectedDoctor(doctor.name)}
              >
                <div className="doctor-info">
                  <div className="doctor-avatar" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      {doctor.name}{" "}
                      <span className="doctor-icon">{doctor.genderIcon}</span>
                      <span className="text-blue-500 text-sm">Verified</span>
                    </h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="doctor-details">📍 {doctor.location}</p>
                    <p className="doctor-details">📞 {doctor.phone}</p>
                    <p className="doctor-details">📧 {doctor.email}</p>
                  </div>
                </div>
                <div className="tags">
                  {doctor.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="buttons">
                  <Link to={`/doctor/${index}`} className="view-details-btn">
                    View Details
                  </Link>
                  <Link to={`/appointment/${index}`} className="make-appointment-btn">
                    Make Appointment
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Section */}
          <motion.div
            className="chat-container glass-effect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="chat-header">Chat with {selectedDoctor}</div>
            <div className="chat-messages" ref={chatMessagesRef}>
              {(messages[selectedDoctor] || []).map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === "user" ? "message-sent" : "message-received"}`}
                >
                  <div className="message-avatar" />
                  <div className="message-content">
                    {message.text}
                    <div className="message-time">{message.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                className="chat-input-field"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage}>
                <svg className="send-icon" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default DoctorChat;