// /components/PasscodeEntry.tsx
"use client";

import { useState } from "react";

interface PasscodeEntryProps {
  setHasAccess: (access: boolean) => void;
}

export default function PasscodeEntry({ setHasAccess }: PasscodeEntryProps) {
  const [passcode, setPasscode] = useState("");

  const handleSubmit = () => {
    // Single access code is "1234"
    if (passcode === "1234") {
      setHasAccess(true);
      localStorage.setItem("accessGranted", "true");
    } else {
      alert("Incorrect access code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-700 p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white text-center">Enter Access Code</h2>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded text-gray-900"
          placeholder="Enter access code"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
