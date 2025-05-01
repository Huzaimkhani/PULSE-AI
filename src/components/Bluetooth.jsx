import React, { useState } from "react";
import { cn } from "../lib/utils";
import { IconBluetooth, IconX } from "@tabler/icons-react";

export default function Bluetooth({ onConnect, onDisconnect }) {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("Turn on your Bluetooth.");
  const [isConnected, setIsConnected] = useState(false);

  const handleBluetoothClick = () => {
    if (isConnected) {
      setIsConnected(false);
      onDisconnect();
    } else {
      setShowPopup(true);
      setMessage("Turn on your Bluetooth.");

      // Simulate scanning for 30 seconds
      setTimeout(() => {
        setMessage("No devices are near.");
      }, 30000);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setMessage("Turn on your Bluetooth.");
  };

  const simulateConnect = () => {
    setIsConnected(true);
    onConnect();
    setShowPopup(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBluetoothClick}
        className={cn(
          "px-4 py-2 rounded-lg flex items-center space-x-2",
          isConnected ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
          "text-white transition-colors"
        )}
      >
        <IconBluetooth className="h-5 w-5" />
        <span>{isConnected ? "Connected" : "No Device Connected"}</span>
      </button>
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Bluetooth Devices</h3>
            <button onClick={closePopup}>
              <IconX className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <p className="text-blue-600">{message}</p>
          {message === "Turn on your Bluetooth." && (
            <button
              onClick={simulateConnect}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simulate Connection
            </button>
          )}
        </div>
      )}
    </div>
  );
}