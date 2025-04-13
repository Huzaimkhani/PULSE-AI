import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { FaHome, FaHeartbeat, FaHistory, FaMicrochip, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';


//App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleLogin = (name) => {
    setIsLoggedIn(true)
    setUsername(name)
    setShowPopup(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            setShowPopup={setShowPopup}
          />
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={username} />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/history" element={<History />} />
            <Route path="/device" element={<Device />} />
            <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} setShowPopup={setShowPopup} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
          </Routes>
          {showPopup && (
            <LoginPopup
              handleLogin={handleLogin}
              setShowPopup={setShowPopup}
            />
          )}
        </div>
      </div>
    </Router>
  )
}

// Navbar Component

function Navbar({ isLoggedIn, handleLogout, setShowPopup }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-50 flex items-center justify-between px-6">
      <div className="text-xl font-semibold flex items-center gap-3">
        <FaHeartbeat className="text-black" size={24} />
        Pulse AI
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/profile" className="flex items-center gap-2 hover:text-gray-600 transition-colors">
          <FaUser size={20} />
          <span>Profile</span>
        </Link>
        <div
          className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={() => (isLoggedIn ? handleLogout() : setShowPopup(true))}
        >
          {isLoggedIn ? <FaSignOutAlt size={19} /> : <FaSignInAlt size={19} />}
          <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
        </div>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <FaHome className="w-6 h-6 text-blue-500" />, name: 'Home' },
    { path: '/analyzer', icon: <FaHeartbeat className="w-6 h-6 text-blue-500" />, name: 'AI Analyzer' },
    { path: '/history', icon: <FaHistory className="w-6 h-6 text-blue-500" />, name: 'History' },
    { path: '/device', icon: <FaMicrochip className="w-6 h-6 text-blue-500" />, name: 'Device' },
    { path: '/profile', icon: <FaUser className="w-6 h-6 text-blue-500" />, name: 'Profile' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-zinc-50 flex flex-col justify-center items-center space-y-6 rounded-r-2xl">
      {navItems.map((item) => (
        <div key={item.path} className="relative group">
          <Link to={item.path}>
            <div
              className={`p-2 rounded-full cursor-pointer transition-colors ${
                location.pathname === item.path ? 'bg-blue-200' : 'hover:bg-blue-100'
              }`}
            >
              {item.icon}
            </div>
          </Link>
          {/* Tooltip */}
          <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}


// Login Popup Component
function LoginPopup({ handleLogin, setShowPopup }) {
  const [tempUsername, setTempUsername] = useState('')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Welcome to Pulse AI</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          className="w-full p-2 border border-blue-200 rounded-lg mb-4"
        />
        <div className="flex gap-4">
          <button
            onClick={() => handleLogin(tempUsername || 'User')}
            className="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => handleLogin(tempUsername || 'User')}
            className="flex-1 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Account
          </button>
        </div>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 text-blue-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// Home Component
function Home({ isLoggedIn, username }) {
  return (
    <div className="pt-20 pl-20 p-6 grid grid-cols-4 grid-rows-[7fr_3fr] gap-6 h-full">
      {/* Top Row (7 rows) */}
      {/* Welcome + Tagline Card (Spans 3 columns) */}
      <div className="col-span-3 row-span-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          Welcome, {isLoggedIn ? username : 'Guest'}
        </h1>
        <p className="text-blue-600 mt-2 text-lg">Your Heart, Our Care – AI-Powered Wellness</p>
      </div>

      {/* Latest AI Result Card (1 column) */}
      <Link to="/history">
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 flex flex-col justify-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
          <h2 className="text-lg font-semibold text-blue-700">Latest AI Result</h2>
          <p className="text-gray-600 mt-2">...</p>
        </div>
      </Link>

      {/* Bottom Row (3 rows) */}
      {/* Analyze AI ECG Card (2 columns) */}
      <Link to="/analyzer">
        <div className="col-span-2 row-start-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
          <h3 className="text-lg font-medium text-blue-600">Analyze AI ECG</h3>
          <div className="mt-4">
            <svg className="w-full h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </Link>

      {/* Talk to PULSE AI Card (1 column) */}
      <Link to="/analyzer">
        <div className="col-span-1 row-start-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
          <h3 className="text-lg font-medium text-blue-600">Talk to PULSE AI</h3>
          <div className="mt-4 flex justify-center">
            <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143l-5.714 2.714L13 21l-2.286-6.857L5 11.857l5.714-2.714L13 3z"></path>
            </svg>
          </div>
        </div>
      </Link>

      {/* Your PULSE AI Card (1 column) */}
      <Link to="/device">
        <div className="col-span-1 row-start-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 flex flex-col items-center justify-between hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
          <h3 className="text-lg font-medium text-blue-600">Your PULSE AI</h3>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Connect Your Device
          </button>
        </div>
      </Link>
    </div>
  );
}


// Profile Component
function Profile({ isLoggedIn, setShowPopup, setIsLoggedIn, setUsername }) {
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <div className="p-6 pt-20 pl-20">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Profile</h1>
      {isLoggedIn ? (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold text-blue-700">Welcome to Your Profile</h2>
          <p className="text-gray-600 mt-2">Manage your account settings here.</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold text-blue-700">Please Log In</h2>
          <p className="text-gray-600 mt-2">Access your profile by logging in.</p>
          <button
            onClick={() => setShowPopup(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}

// Analyzer Page
function Analyzer() {
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Welcome to Pulse AI Analyzer! Upload an ECG file or type a question, and I’ll help you analyze your heart health.' }
  ])
  const [inputText, setInputText] = useState('')
  const [currentGraph, setCurrentGraph] = useState(0)

  const graphs = [
    { title: 'Graph 1', description: 'This graph shows your heart rate variability over time.' },
    { title: 'Graph 2', description: 'This graph displays your ECG waveform analysis.' },
    { title: 'Graph 3', description: 'This graph highlights SpO2 levels during the session.' },
    { title: 'Graph 4', description: 'This graph compares your heart metrics with healthy averages.' }
  ]

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { sender: 'User', text: inputText }])
      setMessages((prev) => [...prev, { sender: 'AI', text: 'I’m analyzing your query… (Placeholder response)' }])
      setInputText('')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setMessages([...messages, { sender: 'User', text: `Uploaded file: ${file.name}` }])
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Analyzing your file… (Placeholder response)' }])
    }
  }

  return (
    //<div className="flex-1 flex flex-col h-screen bg-blue-100">
    <div className="flex-1 flex flex-col h-screen bg-blue-100 pt-15 pl-15">
      {/* Main Content */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Left Side: Chatbot (Larger) */}
        <div className="w-2/3 bg-white rounded-lg p-4 shadow flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.sender === 'User' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Right Side: Graphs (Smaller) */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Carousel for Graphs */}
          <div className="bg-white rounded-lg p-4 shadow h-2/3 relative">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">{graphs[currentGraph].title}</h2>
            <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <button
                onClick={() => setCurrentGraph((prev) => (prev === 0 ? graphs.length - 1 : prev - 1))}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentGraph((prev) => (prev === graphs.length - 1 ? 0 : prev + 1))}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
          {/* Graph Description */}
          <div className="bg-white rounded-lg p-4 shadow h-1/3">
            <h3 className="text-md font-semibold text-blue-700">Description</h3>
            <p className="text-gray-600 mt-2">{graphs[currentGraph].description}</p>
          </div>
        </div>
      </div>
      {/* Bottom Input Area */}
      <div className="bg-white p-4 shadow rounded-lg mx-4 mb-4 flex items-center gap-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message or question..."
          className="flex-1 p-2 border border-blue-200 rounded-lg"
        />
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Upload
        </label>
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}


// History Page
function History() {
  return (
    <div className="p-6 pt-20 pl-20">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <div className="space-y-4">
        {/* Past Result 1 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">March 14, 2025</h2>
          <p className="text-green-600 font-medium">Normal</p>
          <p className="text-gray-500 text-sm">Analyzed: 10:00 AM</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </div>
        {/* Past Result 2 */}
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
  )
}

// Device Page
function Device() {
  return (
    <div className="p-6 pt-20 pl-20">
      <h1 className="text-3xl font-bold mb-6">Device</h1>
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <p className="text-green-600 font-medium">Connected</p>
          <p className="text-gray-500 text-sm">Last sync: 5 mins ago</p>
        </div>
        {/* Device Stats */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Device Stats</h2>
          <p className="text-gray-700">Battery: 85%</p>
          <p className="text-gray-700">Firmware: v1.2.3</p>
        </div>
        {/* Pair Button (if disconnected) */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Pair Now
        </button>
      </div>
    </div>
  )
}

export default App