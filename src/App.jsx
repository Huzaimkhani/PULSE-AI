import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import Analyzer from './components/Analyzer.jsx';
import Home from './components/Home.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import Profile from './components/Profile.jsx';
import Device from './components/Device.jsx';
import DoctorChat from './components/DoctorChat.jsx'; // Import the new DoctorChat component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserProfile(null);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-b from-[#E3F2FD] to-[#BBDEFB] relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col pt-16">
          {/* Logo in the extreme top left */}
          <div className="absolute top-4 left-4">
            <img
              src="/images/pulse-ai-logo1.png"
              alt="Pulse AI Logo"
              className="h-20 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div className="text-2xl font-semibold flex items-center gap-3">
                    <FaHeartbeat className="text-black" size={32} />
                    Pulse AI
                  </div>
                `;
              }}
            />
          </div>

          {/* Profile and Logout in the extreme top right */}
          <div className="absolute top-4 right-4 flex gap-4 items-center">
            <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <FaUser size={20} />
              <span>Profile</span>
            </Link>
            {isLoggedIn && (
              <div
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt size={19} />
                <span>Logout</span>
              </div>
            )}
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={username} />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/history" element={<History />} />
            <Route path="/device" element={<Device />} />
            <Route path="/doctor-chat" element={<DoctorChat />} /> {/* Add the new route */}
            <Route
              path="/profile"
              element={
                <Profile
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                  isLoggedIn={isLoggedIn}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              }
            />
            <Route path="*" element={<div className="p-6 pt-16 pl-20"><h1>404 - Page Not Found</h1></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function History() {
  return (
    <div className="p-6 pt-16 pl-20">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">March 14, 2025</h2>
          <p className="text-green-600 font-medium">Normal</p>
          <p className="text-gray-500 text-sm">Analyzed: 10:00 AM</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">March 13, 2025</h2>
          <p className="text-red-600 font-medium">Arrhythmia Detected</p>
          <p className="text-gray-500 text-sm">Analyzed: 2:00 PM</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;