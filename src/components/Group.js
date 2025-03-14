import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import GroupList from "./GroupList";
import GroupActions from "./GroupAction";
import GroupPosts from "./GroupPosts";
import { fetchUserGroups } from "../utils/groupApi";

const Group = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id; // Assuming user ID is stored in context

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetchGroup, setfetchGroup] = useState(false);
  const [addedquestion, setAddedquestion] = useState(false);
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!selectedGroup) return;

      try {
        const groups = await fetchUserGroups(userId);
        const group = groups.find((g) => g._id === selectedGroup);

        setIsAdmin(group?.admins.some((admin) => admin._id === userId)); // Check if user is an admin
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    checkAdminStatus();
  }, [selectedGroup, userId]);

  return (
    <Container className="mt-4">
      {/* Group Selection */}
      <Row>
        <Col>
          <h2>My Groups</h2>
          <GroupList
            userId={userId}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            fetchGroup={fetchGroup}
          />
        </Col>
      </Row>

      {/* Group Actions (Admins Only for Add/Remove Users, Add Question) */}
      <Row>
        <Col>
          <GroupActions
            selectedGroup={selectedGroup}
            userId={userId}
            isAdmin={isAdmin}
            setfetchGroup={setfetchGroup}
            fetchGroup={fetchGroup}
            setAddedquestion={setAddedquestion}
            addedquestion={addedquestion}
          />
        </Col>
      </Row>

      {/* Group Posts */}
      <Row>
        <Col>
          <h3 className="mt-4">Group Questions</h3>
          <GroupPosts
            selectedGroup={selectedGroup}
            addedquestion={addedquestion}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Group;
