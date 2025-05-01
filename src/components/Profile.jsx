import React, { useState } from 'react';
import { IconUser, IconBrandGoogle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import { ThreeDMarquee } from './ui/3d-marquee';

// Updated array of image paths for the marquee background
const marqueeImages = [
  '/images/ai-circuit-new.jpg',
  '/images/heart-illustration.jpg',
  '/images/wellness-doctor-new.jpg',
  '/images/medical-device-new.jpg',
  '/images/heart-rate-graph-new.jpg',
  '/images/heart-ecg-new.jpg',
  '/images/ecg-monitor-new.jpg',
  '/images/digital-pattern-new.jpg',

];

function Profile({ setIsLoggedIn, setUsername, isLoggedIn, userProfile, setUserProfile }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    age: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    if (formData.email && formData.age && formData.gender) {
      setIsLoggedIn(true);
      setUsername(formData.fullName || 'User');
      setUserProfile(formData);
      setIsModalOpen(false);
    } else {
      alert('Please fill in all required fields (Email, Gender, Age).');
    }
  };

  const handleCreateAccount = () => {
    if (formData.email && formData.age && formData.gender) {
      setIsLoggedIn(true);
      setUsername(formData.fullName || 'User');
      setUserProfile(formData);
      setIsModalOpen(false);
    } else {
      alert('Please fill in all required fields (Email, Gender, Age).');
    }
  };

  const handleGoogleSignUp = () => {
    const googleUser = {
      fullName: 'Google User',
      email: 'googleuser@example.com',
      gender: 'Prefer not to say',
      age: '30',
    };
    setIsLoggedIn(true);
    setUsername(googleUser.fullName);
    setUserProfile(googleUser);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({ ...userProfile });
  };

  const handleSaveEdit = () => {
    setUserProfile(editFormData);
    setUsername(editFormData.fullName || 'User');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const CustomSelect = ({ className, value, onChange, children, ...props }) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);
    const [isInteracted, setIsInteracted] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const handleChange = (e) => {
      setIsInteracted(true);
      onChange(e);
    };

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <select
          value={value}
          onChange={handleChange}
          className={cn(
            `shadow-input flex h-10 w-full rounded-md border-none px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            isInteracted ? 'bg-white' : 'bg-blue-100',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </motion.div>
    );
  };

  const CustomInput = ({ className, value, onChange, ...props }) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);
    const [isInteracted, setIsInteracted] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const handleInputChange = (e) => {
      setIsInteracted(true);
      onChange(e);
    };

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <input
          value={value}
          onChange={handleInputChange}
          className={cn(
            `shadow-input flex h-10 w-full rounded-md border-none px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            isInteracted ? 'bg-white' : 'bg-blue-100',
            className
          )}
          {...props}
        />
      </motion.div>
    );
  };

  const GoogleSignUpButton = ({ onClick, children }) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <button
          onClick={onClick}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg w-full justify-center shadow-input transition duration-400 group-hover/input:shadow-none"
        >
          {children}
        </button>
      </motion.div>
    );
  };

  const ProfileInfoField = ({ label, value }) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300 mb-3"
      >
        <div className="shadow-input flex h-12 w-full rounded-md border-none bg-gray-50 px-4 py-3 text-base text-black transition duration-400 group-hover/input:shadow-none">
          <span className="font-medium">{label}: </span>
          <span className="ml-2">{value}</span>
        </div>
      </motion.div>
    );
  };

  const styles = `
    .background-theme {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
    }

    .modal-overlay {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
    }

    .modal-content {
      max-width: 400px;
      width: 100%;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .profile-info {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0px 2px 3px -1px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgba(25, 28, 33, 0.02), 0px 0px 0px 1px rgba(25, 28, 33, 0.08);
      max-width: 450px;
      width: 100%;
    }

    .close-button {
      background: #E3F2FD;
      color: #1E40AF;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: background 0.3s ease;
    }

    .close-button:hover {
      background: #BBDEFB;
    }

    .login-prompt {
      background: rgba(255, 255, 255, 0.3); /* More transparent for glassmorphism */
      backdrop-filter: blur(10px); /* Stronger blur */
      border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border */
      border-radius: 1rem; /* Rounded corners */
      padding: 1.5rem;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }

    .login-prompt h2 {
      color: #1f2937; /* Darker gray for better contrast */
    }

    .login-prompt p {
      color: #4b5563; /* Slightly darker gray for readability */
    }
  `;

  return (
    <div className="background-theme">
      <style>{styles}</style>
      {/* Background Marquee */}
      <div className="absolute inset-0 z-0">
        <ThreeDMarquee
          images={marqueeImages}
          className="h-full w-full"
        />
      </div>

      {/* Overlay to make the content readable */}
      <div className="absolute inset-0 bg-black/40 z-10"></div> {/* Slightly lighter overlay for visibility */}

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {isLoggedIn && userProfile ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center justify-center gap-3">
              <IconUser className="w-8 h-8 text-[#F06292]" />
              Your Profile
            </h2>
            <div className="profile-info">
              {isEditing ? (
                <div className="space-y-5">
                  <div className="form-group">
                    <Label htmlFor="editFullName">Full Name (Optional)</Label>
                    <CustomInput
                      id="editFullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={editFormData.fullName}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="editEmail">Email</Label>
                    <CustomInput
                      id="editEmail"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="editGender">Gender</Label>
                    <CustomSelect
                      id="editGender"
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="" disabled>Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </CustomSelect>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="editAge">Age</Label>
                    <CustomInput
                      id="editAge"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={editFormData.age}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 w-full text-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 w-full text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ProfileInfoField label="Full Name" value={userProfile.fullName || 'Not provided'} />
                  <ProfileInfoField label="Email" value={userProfile.email} />
                  <ProfileInfoField label="Gender" value={userProfile.gender} />
                  <ProfileInfoField label="Age" value={userProfile.age} />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 w-full text-lg"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleBackToHome}
                      className="bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 w-full text-lg"
                    >
                      Back to Home
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="login-prompt">
            <h2 className="text-3xl font-semibold mb-4 flex items-center justify-center gap-3">
              <IconUser className="w-8 h-8 text-[#F06292]" />
              Profile
            </h2>
            <p className="mb-6 text-lg">
              Please log in to access your profile.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg transition-colors duration-300"
            >
              Login
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
            <div className="modal-content bg-white rounded-lg p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 close-button"
              >
                Close
              </button>
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Welcome to Pulse AI
              </h3>
              <div className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="fullName">Full Name (Optional)</Label>
                  <CustomInput
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="email">Email</Label>
                  <CustomInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="gender">Gender</Label>
                  <CustomSelect
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </CustomSelect>
                </div>
                <div className="form-group">
                  <Label htmlFor="age">Age</Label>
                  <CustomInput
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
                  >
                    Create Account
                  </button>
                </div>
                <div className="flex justify-center">
                  <GoogleSignUpButton onClick={handleGoogleSignUp}>
                    <IconBrandGoogle className="w-5 h-5 text-red-500" />
                    Sign up with Google
                  </GoogleSignUpButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;