"use client";
import React, { useState } from "react";
import { Roommate } from "./RoommateList";
import { splitBillEvenly } from "../utils/helpers";

interface BillFormProps {
  roommates: Roommate[];
  updateRoommates: (updatedRoommates: Roommate[]) => void;
}

const BillForm: React.FC<BillFormProps> = ({ roommates, updateRoommates }) => {
  const [totalBill, setTotalBill] = useState<number>(0);
  const [manualAmounts, setManualAmounts] = useState<{ [key: number]: number }>({});
  const [isManual, setIsManual] = useState<boolean>(false);

  const handleSplitBill = () => {
    if (isManual) {
      // Update amounts based on manual input
      const updatedRoommates = roommates.map((roommate) => ({
        ...roommate,
        amountDue: manualAmounts[roommate.id] || 0,
      }));
      updateRoommates(updatedRoommates);
    } else {
      // Even split
      const updatedRoommates = splitBillEvenly(totalBill, roommates.length, roommates);
      updateRoommates(updatedRoommates);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-100 mb-4">
      <h2 className="text-lg font-bold mb-2">Enter Total Bill</h2>
      <input
        type="number"
        placeholder="Enter total bill"
        value={totalBill}
        onChange={(e) => setTotalBill(parseFloat(e.target.value) || 0)}
        className="p-2 border rounded w-full"
      />
      <div className="mt-2">
        <label className="mr-2">Manual split?</label>
        <input type="checkbox" checked={isManual} onChange={() => setIsManual(!isManual)} />
      </div>

      {isManual &&
        roommates.map((roommate) => (
          <div key={roommate.id} className="mt-2">
            <label>{roommate.name}:</label>
            <input
              type="number"
              value={manualAmounts[roommate.id] || ""}
              onChange={(e) =>
                setManualAmounts({
                  ...manualAmounts,
                  [roommate.id]: parseFloat(e.target.value) || 0,
                })
              }
              className="p-1 border rounded ml-2"
            />
          </div>
        ))}

      <button onClick={handleSplitBill} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Split Bill
      </button>
    </div>
  );
};

export default BillForm;