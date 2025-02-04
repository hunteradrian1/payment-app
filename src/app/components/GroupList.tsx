"use client";
import React from "react";

export interface Group {
  id: number;
  name: string;
  members: any[]; // For simplicity, we’ll store users here (see Roommate below)
}

interface GroupListProps {
  groups: Group[];
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, selectedGroupId, onSelectGroup }) => {
  return (
    <div className="p-4 border rounded bg-gray-50 mb-4">
      <h2 className="font-bold mb-2">Groups</h2>
      {groups.length === 0 && <p>No groups available. Create one!</p>}
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.id}>
            <button
              className={`px-4 py-2 rounded ${
                selectedGroupId === group.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => onSelectGroup(group.id)}
            >
              {group.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;