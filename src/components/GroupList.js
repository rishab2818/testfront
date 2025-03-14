import React, { useEffect, useState } from "react";
import { fetchUserGroups } from "../utils/groupApi";
import { Form } from "react-bootstrap";

const GroupList = ({ userId, selectedGroup, setSelectedGroup, fetchGroup }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchUserGroups(userId);
        console.log("Fetched groups:", data);
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroup(data[0]._id);
          console.log("Default selected group:", data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    loadGroups();
  }, [userId, setSelectedGroup, fetchGroup]);

  // Function to handle group selection change
  const handleGroupChange = (e) => {
    console.log("Selected group changed:", e.target.value);
    setSelectedGroup(e.target.value);
  };

  return (
    <Form.Select value={selectedGroup} onChange={handleGroupChange}>
      {groups.length === 0 ? (
        <option value="">No groups available</option>
      ) : (
        groups.map((group) => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))
      )}
    </Form.Select>
  );
};

export default GroupList;
