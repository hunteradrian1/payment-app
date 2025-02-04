"use client";
import React, { useState } from "react";

interface GroupFormProps {
  onGroupCreate: (groupName: string) => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onGroupCreate }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() !== "") {
      onGroupCreate(groupName.trim());
      setGroupName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 bg-gray-100">
      <label className="block mb-2 font-bold">Create a New Group</label>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Create Group
      </button>
    </form>
  );
};

export default GroupForm;