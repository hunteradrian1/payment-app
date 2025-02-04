"use client";
import React, { useState } from "react";
import GroupForm from "./components/GroupForm";
import GroupList, { Group } from "./components/GroupList";
import UserForm from "./components/UserForm";
import RoommateList, { Roommate } from "./components/RoommateList";
import BillForm from "./components/BillForm";

const initialRoommates: Roommate[] = [
  { id: 1, name: "AJ Corrado", amountDue: 0, paid: false },
  { id: 2, name: "Sam McMonagle", amountDue: 0, paid: false },
  { id: 3, name: "Blake Saito", amountDue: 0, paid: false },
  { id: 4, name: "Dominic Frontino", amountDue: 0, paid: false },
  { id: 5, name: "Hunter Adrian", amountDue: 0, paid: false },
  { id: 6, name: "Ian Oswalt", amountDue: 0, paid: false },
  { id: 7, name: "Harrison Trahan", amountDue: 0, paid: false },
  { id: 8, name: "Keegan Rothrock", amountDue: 0, paid: false },
  { id: 9, name: "Drew Clearie", amountDue: 0, paid: false },
];

const Home: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: "House Utils", members: initialRoommates },
    { id: 2, name: "Poker", members: initialRoommates },
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [nextGroupId, setNextGroupId] = useState<number>(2);
  const [nextUserId, setNextUserId] = useState<number>(10);

  // Create a new group
  const handleGroupCreate = (groupName: string) => {
    const newGroup: Group = {
      id: nextGroupId,
      name: groupName,
      members: [],
    };
    setGroups([...groups, newGroup]);
    setNextGroupId(nextGroupId + 1);
  };

  // Add a new user to the selected group
  const handleUserCreate = (userName: string) => {
    if (selectedGroupId === null) return;
    const newUser: Roommate = {
      id: nextUserId,
      name: userName,
      amountDue: 0,
      paid: false,
    };
    setNextUserId(nextUserId + 1);
    setGroups(
      groups.map((group) =>
        group.id === selectedGroupId
          ? { ...group, members: [...group.members, newUser] }
          : group
      )
    );
  };

  // Update members for the selected group (e.g., after bill splitting)
  const updateGroupMembers = (updatedMembers: Roommate[]) => {
    if (selectedGroupId === null) return;
    setGroups(
      groups.map((group) =>
        group.id === selectedGroupId ? { ...group, members: updatedMembers } : group
      )
    );
  };

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Utility Bill Splitter with Groups</h1>
      <GroupForm onGroupCreate={handleGroupCreate} />
      <GroupList groups={groups} selectedGroupId={selectedGroupId} onSelectGroup={setSelectedGroupId} />

      {selectedGroup ? (
        <>
          <h2 className="text-xl font-bold mb-2">Group: {selectedGroup.name}</h2>
          <UserForm onUserCreate={handleUserCreate} />
          <BillForm roommates={selectedGroup.members} updateRoommates={updateGroupMembers} />
          <RoommateList roommates={selectedGroup.members} updateRoommates={updateGroupMembers} />
        </>
      ) : (
        <p>Please select a group to add users and split bills.</p>
      )}
    </main>
  );
};

export default Home;