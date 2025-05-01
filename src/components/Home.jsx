import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ContainerTextFlip } from './ui/container-text-flip.jsx';

// Lazy load the Spline component
const Spline = lazy(() => import('@splinetool/react-spline'));

// Import the doctor image with the correct extension
import doctorImage from '../assets/doctor-image.jpeg';

const styles = `
  .spline-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .spline-container,
  .spline-container * {
    position: relative !important;
  }

  .spline-container a[href*="spline.design"],
  .spline-container a[href*="spline"],
  .spline-container [style*="position: absolute"],
  .spline-container [class*="spline"],
  .spline-container a,
  .spline-container div[style*="position"],
  .spline-container div[class*="branding"],
  .spline-container div[class*="watermark"],
  .spline-container [data-testid*="spline"],
  .spline-container [style*="bottom"],
  .spline-container [style*="right"],
  .spline-container [style*="z-index: 9999"],
  .spline-container [style*="z-index"],
  .spline-container [class*="spline-branding"],
  .spline-container [class*="spline-watermark"],
  .spline-container [class*="built-with-spline"],
  .spline-container [style*="position: fixed"],
  .spline-container [style*="display: flex"],
  .spline-container [style*="align-items: center"],
  .spline-container [data-spline*],
  .spline-container [class*="spline-attribution"],
  .spline-container [id*="spline"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .css-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .css-particles span {
    position: absolute;
    background: #F06292;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    animation: moveParticles 3s infinite ease-in-out;
    opacity: 0.5;
  }

  @keyframes moveParticles {
    0% { transform: translate(0, 0); opacity: 0.5; }
    50% { transform: translate(20px, 20px); opacity: 0.8; }
    100% { transform: translate(0, 0); opacity: 0.5; }
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

  .ecg-waveform {
    width: 100%;
    height: 80px;
    overflow: hidden;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .ecg-waveform .dotlottie-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: stretch;
    align-items: center;
  }

  .ecg-waveform .dotlottie-container canvas {
    width: 100% !important;
    height: auto !important;
    object-fit: cover;
  }

  .card-fixed-height {
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .doctor-card-height {
    height: 150px; /* Match the height of other cards in the second row */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .latest-result-waveform {
    width: 100%;
    height: 40px;
    overflow: hidden;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .latest-result-waveform .dotlottie-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: stretch;
    align-items: center;
  }

  .latest-result-waveform .dotlottie-container canvas {
    width: 100% !important;
    height: auto !important;
    object-fit: cover;
  }

  .segmented-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .segment-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    width: 100%;
    height: 50%;
  }

  .doctor-card {
    position: relative;
    overflow: hidden;
    z-index: 1; /* Ensure the card stays below other elements */
  }

  .doctor-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3); /* Dark overlay for better text readability */
    z-index: 1;
  }

  .doctor-card-content {
    position: relative;
    z-index: 2;
  }

  /* Ensure the history card doesn't overlap */
  .history-card {
    position: relative;
    z-index: 0;
  }
`;

function ECGWaveform() {
  return (
    <DotLottieReact
      src="https://lottie.host/cac0e848-28e1-44f9-83a6-c2480d106452/0LXQf2Kvpt.lottie"
      loop={true}
      autoplay={true}
      speed={0.8}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function LatestResultWaveform() {
  return (
    <DotLottieReact
      src="https://lottie.host/3c9bb0b5-0c8f-4049-b0d0-5ce4f49c03b8/ECGbjYjOqX.lottie"
      loop={true}
      autoplay={true}
      speed={0.8}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function Home({ isLoggedIn = false, username = 'Guest' }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.02, y: -4, boxShadow: '0 10px 15px rgba(0,0,0,0.1)', transition: { type: 'spring', stiffness: 300 } },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { type: 'spring', stiffness: 400 } },
  };

  const pulseCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(240, 98, 146, 0.3)', transition: { type: 'spring', stiffness: 300 } },
  };

  const { ref: splineRef, inView: splineInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const splineContainerRef = useRef(null);

  useEffect(() => {
    const removeSplineWatermark = () => {
      if (!splineContainerRef.current) return;

      const checkAndRemove = () => {
        const elements = splineContainerRef.current.querySelectorAll(
          'a[href*="spline"], [class*="spline"], [class*="branding"], [class*="watermark"], [data-testid*="spline"], [class*="spline-attribution"], [id*="spline"], div, a, span'
        );
        elements.forEach((element) => {
          const textContent = element.textContent || '';
          if (
            textContent.toLowerCase().includes('spline') ||
            element.href?.includes('spline') ||
            element.className?.toLowerCase().includes('spline') ||
            element.id?.toLowerCase().includes('spline')
          ) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            element.remove();
          }
        });
      };

      checkAndRemove();
      const observer = new MutationObserver(checkAndRemove);
      observer.observe(splineContainerRef.current, { childList: true, subtree: true });
      const interval = setInterval(checkAndRemove, 500);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    };

    if (splineInView) {
      removeSplineWatermark();
    }
  }, [splineInView]);

  return (
    <div className="pt-20 pl-20 p-6 grid grid-cols-4 grid-rows-[7fr_3fr] gap-6 h-full bg-gradient-to-b from-[#E3F2FD] to-[#BBDEFB]">
      <style>{styles}</style>

      <motion.div
        ref={splineRef}
        className="col-span-3 row-span-1 bg-white rounded-2xl shadow-md border border-blue-200 p-8 flex flex-col justify-center relative overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-blue-800 flex items-center gap-3 relative z-10">
              <motion.svg
                className="w-10 h-10 text-[#F06292]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                whileHover="hover"
                variants={iconVariants}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </motion.svg>
              Welcome, {isLoggedIn ? username : 'Guest'}
            </h1>
            <p className="text-lg font-medium text-gray-600 mt-3 relative z-10">
              Your Heart –{' '}
              <ContainerTextFlip
                words={['Our Cure', 'Our Care', 'Our Passion']}
                interval={3000}
                animationDuration={700}
                textClassName="text-gray-600 text-lg font-medium"
                className="px-1"
              />{' '}
              – AI-Powered Wellness
            </p>
            <motion.button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg relative z-10"
              whileHover={{ scale: 1.05, backgroundColor: '#1565C0' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
          <div className="spline-wrapper">
            <div ref={splineContainerRef} className="w-72 h-72 relative z-10 spline-container">
              {splineInView ? (
                <Suspense fallback={<div className="w-72 h-72 bg-gray-200 rounded-full animate-pulse" />}>
                  <Spline scene="https://prod.spline.design/8ajZEYwBM5yew7fE/scene.splinecode" className="w-full h-full" />
                </Suspense>
              ) : (
                <div className="w-72 h-72 bg-gray-200 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Link to="/history">
        <motion.div
          className="col-span-1 row-span-1 bg-white rounded-2xl shadow-md border border-blue-200 p-6 flex flex-col justify-center history-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-semibold text-blue-700">Latest AI Result</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="latest-result-waveform">
              <LatestResultWaveform />
            </div>
            <p className="text-gray-600 text-sm text-center mt-2">
              No Recent Results – Analyze an ECG to Get Started
            </p>
          </div>
        </motion.div>
      </Link>

      <Link to="/analyzer">
        <motion.div
          className="col-span-1 row-start-2 bg-white rounded-xl shadow-md border border-blue-200 p-6 card-fixed-height"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <h3 className="text-xl font-semibold text-blue-600">
            Analyze AI ECG
          </h3>
          <div className="mt-4 flex justify-center">
            <div className="ecg-waveform">
              <ECGWaveform />
            </div>
          </div>
        </motion.div>
      </Link>

      <Link to="/analyzer">
        <motion.div
          className="col-span-1 row-start-2 bg-white rounded-xl shadow-md border border-blue-200 p-6 card-fixed-height"
          variants={pulseCardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Talk to PULSE AI</h3>
          <div className="relative w-16 h-16">
            <div className="css-particles">
              {[...Array(30)].map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </Link>

      <Link to="/device">
        <motion.div
          className="col-span-1 row-start-2 bg-white rounded-xl shadow-md border border-blue-200 p-6 card-fixed-height"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className="segmented-card">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Connect Your Device</h3>
            <div className="segment-bottom">
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: '#1565C0' }}
                whileTap={{ scale: 0.95 }}
              >
                Connect Your Device
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Talk to Your Doctor Card */}
      <Link to="/doctor-chat">
        <motion.div
          className="col-span-1 row-start-2 bg-white rounded-xl shadow-md border border-blue-200 p-6 doctor-card-height doctor-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          style={{
            backgroundImage: `url(${doctorImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '1312 / 736', // Maintain the provided dimensions ratio
          }}
        >
          <div className="doctor-card-content flex flex-col items-start">
            <h3 className="text-xl font-semibold text-white mb-2">Talk to Your Doctor</h3>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export default Home;