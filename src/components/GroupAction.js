import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import {
  createGroup,
  addMembersToGroup,
  removeMemberFromGroup,
  addAdminToGroup,
  addPostToGroup,
} from "../utils/groupApi";
import ToastMessage from "./ToastMessage";

const upscSubjects = [
  "History",
  "Geography",
  "Polity",
  "Economics",
  "Science & Tech",
  "Environment",
  "International Relations",
  "Ethics",
];
const GroupActions = ({
  selectedGroup,
  userId,
  isAdmin,
  fetchGroup,
  setfetchGroup,
  setAddedquestion,
  addedquestion,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const handleCreateGroup = async () => {
    try {
      const response = await createGroup({
        name: groupName,
        createdBy: userId,
        privacy: "private",
      });
      setShowToast(true);
      setToastMessage("Group created successfully!");
      setfetchGroup(!fetchGroup);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating group:", error);
      setShowToast(true);
      setToastMessage(
        error.response?.data?.message ||
          "Failed to create group. Please try again."
      );
    }
  };

  const handleAddMembers = async () => {
    try {
      await addMembersToGroup(selectedGroup, emails.split(","));
      setShowToast(true);
      setToastMessage("Members added successfully!");
      setShowAddMemberModal(false);
    } catch (error) {
      setShowToast(true);
      setToastMessage(
        `Failed to add members: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleRemoveMember = async () => {
    try {
      await removeMemberFromGroup(selectedGroup, emails);
      setShowToast(true);
      setToastMessage("Member removed successfully!");
      setShowRemoveMemberModal(false);
    } catch (error) {
      setShowToast(true);
      setToastMessage(
        `Failed to remove member: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleAddPost = async () => {
    try {
      await addPostToGroup(selectedGroup, {
        user: userId,
        title: postTitle,
        category: selectedCategories,
      });
      setShowToast(true);
      setToastMessage("Post added successfully!");
      setShowAddPostModal(false);
      setAddedquestion(!addedquestion);
    } catch (error) {
      setShowToast(true);
      setToastMessage(
        `Failed to add post: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleAddAdmin = async () => {
    try {
      console.log(emails);
      await addAdminToGroup(selectedGroup, emails.split(","));
      setShowToast(true);
      setToastMessage("Admin added successfully!");
      setShowAddAdminModal(false);
    } catch (error) {
      setShowToast(true);
      setToastMessage(
        `Failed to add admin: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="d-flex gap-2 mt-3">
      <Button variant="primary btn-sm" onClick={() => setShowCreateModal(true)}>
        Create Group
      </Button>
      {isAdmin && (
        <>
          <Button
            variant="secondary btn-sm"
            onClick={() => setShowAddMemberModal(true)}
          >
            Add Members
          </Button>
          <Button
            variant="danger btn-sm"
            onClick={() => setShowRemoveMemberModal(true)}
          >
            Remove Member
          </Button>
          <Button
            variant="success btn-sm"
            onClick={() => setShowAddPostModal(true)}
          >
            Add Question
          </Button>
          <Button
            variant="warning btn-sm"
            onClick={() => setShowAddAdminModal(true)}
          >
            Add Admin
          </Button>
        </>
      )}

      {/* Create Group Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateGroup}>Create</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Members Modal */}
      <Modal
        show={showAddMemberModal}
        onHide={() => setShowAddMemberModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter emails, comma-separated"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddMembers}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Remove Member Modal */}
      <Modal
        show={showRemoveMemberModal}
        onHide={() => setShowRemoveMemberModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter email to remove"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRemoveMember}>Remove</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Post Modal */}
      <Modal
        show={showAddPostModal}
        onHide={() => setShowAddPostModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <Form.Group>
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              value={selectedCategories}
              onChange={(e) => setSelectedCategories([e.target.value])}
            >
              <option value="">Select a category</option>
              {upscSubjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddPost}>Post</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Admin Modal */}
      <Modal
        show={showAddAdminModal}
        onHide={() => setShowAddAdminModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter email to remove"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddAdmin}>Add Admin</Button>
        </Modal.Footer>
      </Modal>
      <ToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
      />
    </div>
  );
};

export default GroupActions;
