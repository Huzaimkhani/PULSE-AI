import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { Chart as ChartJS } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  IconUserCircle,
  IconPlayerSkipBack,
  IconPlayerPlay,
  IconPlayerPause,
  IconDownload,
  IconEye,
  IconRobot,
} from "@tabler/icons-react";
import Bluetooth from "./Bluetooth";

// Register the annotation plugin
ChartJS.register(annotationPlugin);

// Mock real-time data with beat annotations
const generateMockECGData = (durationSeconds, baseBPM = 80, fluctuate = false) => {
  const samplesPerSecond = 250;
  const totalSamples = durationSeconds * samplesPerSecond;
  const data = [];
  const annotations = [];

  let bpm = baseBPM;
  let lastBeatTime = -1;

  for (let i = 0; i < totalSamples; i++) {
    const time = i / samplesPerSecond;
    let value = 0;

    if (fluctuate && i % (samplesPerSecond * 5) === 0) {
      bpm = Math.max(60, Math.min(100, baseBPM + (Math.random() - 0.5) * 20));
    }
    const beatInterval = 60 / bpm;

    const timeSinceLastBeat = time - lastBeatTime;
    if (timeSinceLastBeat >= beatInterval) {
      lastBeatTime = time;
    }

    const beatPhase = (timeSinceLastBeat % beatInterval) / beatInterval;

    if (beatPhase < 0.1 / beatInterval) {
      value += 0.3 * Math.sin((Math.PI * beatPhase * beatInterval) / 0.1);
    } else if (beatPhase < (0.1 + 0.06) / beatInterval) {
      const qrsPhase = (beatPhase * beatInterval - 0.1) / 0.06;
      if (qrsPhase < 0.2) value -= 0.2;
      else if (qrsPhase < 0.6) value += 1.2 * (qrsPhase - 0.2) * 2.5;
      else value -= 0.3 * (qrsPhase - 0.6) * 2.5;
    } else if (beatPhase < (0.1 + 0.06 + 0.2) / beatInterval) {
      value += 0.4 * Math.sin((Math.PI * (beatPhase * beatInterval - 0.16)) / 0.2);
    }

    value += (Math.random() - 0.5) * 0.05; // Reduced noise for smoother motion

    data.push({ x: time, y: value });

    if (value > 1.0 && timeSinceLastBeat >= beatInterval * 0.8) {
      annotations.push({ x: time, y: value, label: "N" });
    }
  }

  return { data, annotations };
};

// Analyze ECG data for P-waves, QRS complexes, T-waves, R-R intervals
const analyzeECGData = (ecgData, annotations) => {
  const samplesPerSecond = 250;
  const analysis = {
    pWaves: [],
    qrsComplexes: [],
    tWaves: [],
    rrIntervals: [],
    heartActivity: "",
  };

  // Identify P-waves, QRS complexes, and T-waves based on annotations
  annotations.forEach((rPeak, index) => {
    const rPeakSample = Math.floor(rPeak.x * samplesPerSecond);
    const rPeakTime = rPeak.x;

    // P-wave: Approximately 0.1s before R-peak
    const pWaveStartSample = Math.max(0, rPeakSample - 0.1 * samplesPerSecond);
    const pWaveData = ecgData.slice(pWaveStartSample, rPeakSample).filter(d => d.y > 0.2);
    if (pWaveData.length > 0) {
      analysis.pWaves.push({ time: pWaveData[0].x, amplitude: pWaveData[0].y });
    }

    // QRS complex: Around the R-peak (0.06s duration)
    const qrsStartSample = Math.max(0, rPeakSample - 0.03 * samplesPerSecond);
    const qrsEndSample = Math.min(ecgData.length - 1, rPeakSample + 0.03 * samplesPerSecond);
    const qrsData = ecgData.slice(qrsStartSample, qrsEndSample);
    analysis.qrsComplexes.push({
      startTime: ecgData[qrsStartSample].x,
      endTime: ecgData[qrsEndSample].x,
      peakTime: rPeakTime,
      peakAmplitude: rPeak.y,
    });

    // T-wave: Approximately 0.2s after R-peak
    const tWaveStartSample = rPeakSample + 0.1 * samplesPerSecond;
    const tWaveEndSample = Math.min(ecgData.length - 1, rPeakSample + 0.3 * samplesPerSecond);
    const tWaveData = ecgData.slice(tWaveStartSample, tWaveEndSample).filter(d => d.y > 0.3);
    if (tWaveData.length > 0) {
      analysis.tWaves.push({ time: tWaveData[0].x, amplitude: tWaveData[0].y });
    }

    // R-R intervals
    if (index > 0) {
      const prevRPeakTime = annotations[index - 1].x;
      const rrInterval = rPeakTime - prevRPeakTime;
      analysis.rrIntervals.push(rrInterval);
    }
  });

  // Calculate average heart rate and assess heart activity
  const avgRRInterval = analysis.rrIntervals.length > 0
    ? analysis.rrIntervals.reduce((a, b) => a + b, 0) / analysis.rrIntervals.length
    : 0;
  const heartRate = avgRRInterval > 0 ? Math.round(60 / avgRRInterval) : 0;

  if (heartRate >= 60 && heartRate <= 100) {
    analysis.heartActivity = "Normal sinus rhythm (Heart rate: " + heartRate + " BPM)";
  } else if (heartRate < 60) {
    analysis.heartActivity = "Bradycardia (Heart rate: " + heartRate + " BPM)";
  } else {
    analysis.heartActivity = "Tachycardia (Heart rate: " + heartRate + " BPM)";
  }

  return analysis;
};

export default function Device() {
  const [deviceData, setDeviceData] = useState(null);
  const [windowDuration, setWindowDuration] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [averageHeartRate, setAverageHeartRate] = useState(null);
  const [capturedData, setCapturedData] = useState(null);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showPulseAIAnimation, setShowPulseAIAnimation] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const tooltipRef = useRef(null);

  // Initialize mock data
  useEffect(() => {
    if (isSampleMode) {
      const { data, annotations } = generateMockECGData(60, 80, true);
      setDeviceData({ ecgData: data, annotations });
      setWindowDuration(5);
    } else if (isConnected) {
      // This will be populated by real device data via Bluetooth.jsx
      const { data, annotations } = generateMockECGData(60, 80, true); // Mock for now
      setDeviceData({ ecgData: data, annotations });
    } else {
      setDeviceData(null);
    }
  }, [isSampleMode, isConnected]);

  // Real-time update effect
  useEffect(() => {
    if (!isPlaying || !deviceData) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 0.1;
        const totalDuration = isSampleMode ? 60 : 60; // 1 minute for both modes
        if (newTime >= totalDuration) {
          setIsPlaying(false);
          captureAndSaveData();
          return totalDuration;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, deviceData]);

  // Initialize and update ECG chart
  useEffect(() => {
    if (!deviceData || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const windowSize = windowDuration;
    const totalDuration = isSampleMode ? 60 : 60;
    const samplesPerSecond = 250;
    const startSample = Math.floor(currentTime * samplesPerSecond);
    const endSample = Math.min(
      startSample + windowSize * samplesPerSecond,
      totalDuration * samplesPerSecond
    );
    const visibleData = deviceData.ecgData.slice(0, endSample).map((point) => ({
      x: point.x - (startSample / samplesPerSecond),
      y: point.y,
    }));
    const visibleAnnotations = deviceData.annotations
      .filter((anno) => anno.x >= currentTime && anno.x < currentTime + windowSize)
      .map((anno) => ({
        ...anno,
        x: anno.x - (startSample / samplesPerSecond),
      }));

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "ECG (V5)",
            data: visibleData,
            borderColor: "black",
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            tension: 0.1, // Slight tension for smoother curves
          },
          {
            label: "R-Peaks",
            data: visibleAnnotations,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            pointStyle: "circle",
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointBackgroundColor: "rgba(255, 99, 132, 0.8)",
            pointBorderColor: "rgba(255, 255, 255, 0.8)",
            showLine: false,
            animation: {
              onComplete: function () {
                const chart = this;
                chart.data.datasets[1].data.forEach((point, index) => {
                  const meta = chart.getDatasetMeta(1);
                  const element = meta.data[index];
                  if (element) {
                    element.options.backgroundColor = "rgba(255, 99, 132, 0.8)";
                    element.options.borderColor = "rgba(255, 255, 255, 0.8)";
                    element.options.radius = 6 + Math.sin(Date.now() / 200) * 2; // Pulsating effect
                  }
                });
                chart.update();
              },
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: windowSize,
            title: {
              display: true,
              text: "Time (seconds)",
              color: "#3B82F6",
            },
            grid: {
              color: (context) => {
                if (context.tick.value % 0.2 < 0.001) {
                  return "rgba(255, 102, 102, 0.5)"; // Major grid lines (0.2s)
                }
                return "rgba(255, 102, 102, 0.2)"; // Minor grid lines (0.04s)
              },
              tickLength: 0,
            },
            ticks: {
              color: "#3B82F6",
              stepSize: 1,
              callback: (value) => {
                const totalSeconds = currentTime + value;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = Math.floor(totalSeconds % 60);
                const milliseconds = Math.floor((totalSeconds % 1) * 1000);
                return `${minutes.toString().padStart(2, "0")}:${seconds
                  .toString()
                  .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Amplitude (mV)",
              color: "#3B82F6",
            },
            grid: {
              color: (context) => {
                if (context.tick.value % 0.5 === 0) {
                  return "rgba(255, 102, 102, 0.5)"; // Major grid lines (0.5mV)
                }
                return "rgba(255, 102, 102, 0.2)"; // Minor grid lines (0.1mV)
              },
              tickLength: 0,
            },
            ticks: {
              color: "#3B82F6",
              stepSize: 0.1,
            },
            min: -1.5,
            max: 1.5,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#3B82F6",
              padding: 20,
              usePointStyle: true,
              boxWidth: 10,
              boxHeight: 10,
              generateLabels: (chart) => {
                return chart.data.datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.label === "ECG (V5)" ? "black" : "rgba(255, 99, 132, 0.8)",
                  strokeStyle: dataset.label === "ECG (V5)" ? "black" : "rgba(255, 99, 132, 1)",
                  lineWidth: 2,
                  pointStyle: dataset.label === "ECG (V5)" ? "rect" : "circle",
                  datasetIndex: i,
                }));
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (context.dataset.label === "R-Peaks") {
                  return `R-Peak (${context.raw.label})`;
                }
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} mV`;
              },
            },
          },
          annotation: {
            annotations: visibleAnnotations.map((anno) => ({
              type: "label",
              xValue: anno.x,
              yValue: -1.5,
              content: anno.label,
              color: "blue",
              font: {
                size: 12,
              },
            })),
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [deviceData, currentTime, windowDuration, isSampleMode]);

  // Calculate average heart rate
  const calculateAverageHeartRate = () => {
    if (!deviceData) return;
    const rPeaks = deviceData.annotations.length;
    const durationMinutes = (isSampleMode ? 60 : 60) / 60;
    const heartRate = Math.round(rPeaks / durationMinutes);
    setAverageHeartRate(heartRate);
  };

  // Handle Sample ECG button
  const handleSampleECG = () => {
    setIsSampleMode(true);
    setIsPlaying(true);
    calculateAverageHeartRate();
  };

  // Handle tooltip visibility
  const showTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "1";
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
    }
  };

  // Handle start, stop, and rewind
  const handleStart = () => {
    if (isConnected || isSampleMode) {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleRewind = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Capture and save 2500 samples as PNG and CSV
  const captureAndSaveData = () => {
    if (!deviceData) return;

    const samplesPerSecond = 250;
    const totalSamples = 2500; // 10 seconds of data
    const startSample = Math.max(0, deviceData.ecgData.length - totalSamples);
    const capturedSamples = deviceData.ecgData.slice(startSample, startSample + totalSamples);
    const capturedAnnotations = deviceData.annotations.filter(
      (anno) => anno.x >= capturedSamples[0].x && anno.x <= capturedSamples[capturedSamples.length - 1].x
    );

    const csvContent = capturedSamples.map((sample) => `${sample.x},${sample.y}`).join("\n");
    const csvBlob = new Blob([`Time (s),Amplitude (mV)\n${csvContent}`], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvBlob);

    const canvas = chartRef.current;
    const pngUrl = canvas.toDataURL("image/png");

    const analysis = analyzeECGData(capturedSamples, capturedAnnotations);
    setAnalysisResult(analysis);

    setCapturedData({ csvUrl, pngUrl });
  };

  // Open PNG in new window
  const viewECGImage = () => {
    if (capturedData?.pngUrl) {
      const newWindow = window.open();
      newWindow.document.write(`<img src="${capturedData.pngUrl}" alt="ECG Capture" />`);
    }
  };

  // Handle Pulse AI click
  const handlePulseAIClick = () => {
    setShowPulseAIAnimation(true);
    setTimeout(() => {
      setShowPulseAIAnimation(false);
      setShowAnalysis(true);
    }, 10000); // 10-second animation
  };

  if (!deviceData && !isConnected && !isSampleMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto ml-16 lg:ml-20">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Device</h1>
            <div className="flex space-x-4">
              <Link to="/profile" className="text-blue-600 hover:underline flex items-center">
                <IconUserCircle className="h-5 w-5 mr-1" />
                Profile
              </Link>
              <Link to="/logout" className="text-blue-600 hover:underline flex items-center">
                <IconUserCircle className="h-5 w-5 mr-1" />
                Logout
              </Link>
            </div>
          </header>
          <div className="text-blue-600">Please connect a device or use Sample mode to view ECG.</div>
          <div className="mt-4">
            <Bluetooth onConnect={() => setIsConnected(true)} onDisconnect={() => setIsConnected(false)} />
            <div className="relative inline-block mt-4">
              <button
                onClick={handleSampleECG}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                disabled={isConnected}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors",
                  isConnected ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                <span>Sample (Avg HR)</span>
              </button>
              <div
                ref={tooltipRef}
                className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-sm rounded-lg px-3 py-1 opacity-0 transition-opacity duration-300 shadow-lg"
              >
                Click to play the sample ECG
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto ml-16 lg:ml-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Device</h1>
          <div className="flex space-x-4">
            <Link to="/profile" className="text-blue-600 hover:underline flex items-center">
              <IconUserCircle className="h-5 w-5 mr-1" />
              Profile
            </Link>
            <Link to="/logout" className="text-blue-600 hover:underline flex items-center">
              <IconUserCircle className="h-5 w-5 mr-1" />
              Logout
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Section: ECG Graph */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-6 shadow-lg relative"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-900">Real-Time ECG</h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <button
                      onClick={handleSampleECG}
                      onMouseEnter={showTooltip}
                      onMouseLeave={hideTooltip}
                      disabled={isConnected}
                      className={cn(
                        "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors",
                        isConnected ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      <span>Sample (Avg HR)</span>
                    </button>
                    <div
                      ref={tooltipRef}
                      className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-sm rounded-lg px-3 py-1 opacity-0 transition-opacity duration-300 shadow-lg"
                    >
                      Click to play the sample ECG
                    </div>
                  </div>
                  <Bluetooth onConnect={() => setIsConnected(true)} onDisconnect={() => setIsConnected(false)} />
                </div>
              </div>
              {averageHeartRate && (
                <div className="mb-4 text-blue-600">
                  Average Heart Rate: {averageHeartRate} BPM
                </div>
              )}
              <div className="relative h-96">
                <canvas ref={chartRef} style={{ backgroundColor: "white" }}></canvas>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={handleStart}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <IconPlayerPlay className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={handleStop}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <IconPlayerPause className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    onClick={handleRewind}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <IconPlayerSkipBack className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-blue-600">Window Duration:</label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="5"
                    value={windowDuration}
                    onChange={(e) => {
                      setWindowDuration(Number(e.target.value));
                      setCurrentTime(0);
                      setIsPlaying(false);
                    }}
                    className="w-32 accent-blue-600"
                  />
                  <span className="text-blue-600">{windowDuration} seconds</span>
                </div>
              </div>
              {capturedData && (
                <div className="flex justify-center space-x-4 mt-6">
                  <a
                    href={capturedData.csvUrl}
                    download="ecg_report.csv"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <IconDownload className="h-5 w-5" />
                    <span>Download Your CSV Report</span>
                  </a>
                  <button
                    onClick={viewECGImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <IconEye className="h-5 w-5" />
                    <span>View Your 2500 Samples ECG</span>
                  </button>
                  <button
                    onClick={handlePulseAIClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <IconRobot className="h-5 w-5" />
                    <span>Talk to Pulse AI to Analyze It</span>
                  </button>
                </div>
              )}
              {/* Pulse AI Animation */}
              {showPulseAIAnimation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-blue-600">Pulse AI is taking care of your ECG...</p>
                </div>
              )}
              {/* Analysis Result */}
              {showAnalysis && analysisResult && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">ECG Analysis by Pulse AI</h3>
                  <div className="text-blue-600">
                    <p><strong>Heart Activity:</strong> {analysisResult.heartActivity}</p>
                    <p><strong>P-Waves Detected:</strong> {analysisResult.pWaves.length}</p>
                    <ul className="list-disc list-inside">
                      {analysisResult.pWaves.slice(0, 5).map((pWave, idx) => (
                        <li key={idx}>Time: {pWave.time.toFixed(2)}s, Amplitude: {pWave.amplitude.toFixed(2)}mV</li>
                      ))}
                    </ul>
                    <p><strong>QRS Complexes Detected:</strong> {analysisResult.qrsComplexes.length}</p>
                    <ul className="list-disc list-inside">
                      {analysisResult.qrsComplexes.slice(0, 5).map((qrs, idx) => (
                        <li key={idx}>
                          Start: {qrs.startTime.toFixed(2)}s, End: {qrs.endTime.toFixed(2)}s, 
                          Peak: {qrs.peakTime.toFixed(2)}s ({qrs.peakAmplitude.toFixed(2)}mV)
                        </li>
                      ))}
                    </ul>
                    <p><strong>T-Waves Detected:</strong> {analysisResult.tWaves.length}</p>
                    <ul className="list-disc list-inside">
                      {analysisResult.tWaves.slice(0, 5).map((tWave, idx) => (
                        <li key={idx}>Time: {tWave.time.toFixed(2)}s, Amplitude: {tWave.amplitude.toFixed(2)}mV</li>
                      ))}
                    </ul>
                    <p><strong>R-R Intervals:</strong> {analysisResult.rrIntervals.length}</p>
                    <ul className="list-disc list-inside">
                      {analysisResult.rrIntervals.slice(0, 5).map((rr, idx) => (
                        <li key={idx}>{rr.toFixed(2)}s</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}