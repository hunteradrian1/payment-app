"use client";
import React from "react";

export interface Roommate {
  id: number;
  name: string;
  amountDue: number;
  paid: boolean;
}

interface RoommateListProps {
  roommates: Roommate[];
  updateRoommates: (updatedRoommates: Roommate[]) => void;
}

const RoommateList: React.FC<RoommateListProps> = ({ roommates, updateRoommates }) => {
  const togglePaid = (id: number) => {
    const updatedRoommates = roommates.map((roommate) =>
      roommate.id === id ? { ...roommate, paid: !roommate.paid } : roommate
    );
    updateRoommates(updatedRoommates);
  };

  return (
    <div className="mt-4 space-y-2">
      {roommates.map((roommate) => (
        <div
          key={roommate.id}
          className={`p-2 border rounded-md ${
            roommate.paid ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <span>
            {roommate.name} - ${roommate.amountDue.toFixed(2)}
          </span>
          <button
            className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => togglePaid(roommate.id)}
          >
            {roommate.paid ? "Mark Unpaid" : "Mark Paid"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoommateList;