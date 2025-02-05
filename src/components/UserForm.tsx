"use client";
import React, { useState } from "react";

interface UserFormProps {
  onUserCreate: (userName: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreate }) => {
  const [userName, setUserName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      onUserCreate(userName.trim());
      setUserName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 bg-gray-100">
      <label className="block mb-2 font-bold">Add a New User</label>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add User
      </button>
    </form>
  );
};

export default UserForm;