import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import UPSCQuestionForm from "./UPSCQuestionForm";
import NewsForm from "./NewsForm";
import AuthContext from "../context/AuthContext";
import { Toast, ToastContainer } from "react-bootstrap";
import "./Form.css";
const PostModal = ({ mode, show, handleClose }) => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const isUserLoggedIn = !!(user?.googleId && user?.name); // ✅ Improved check
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const handleSignIn = () => {
    // TODO: Replace alert with actual navigation logic
    setToastMessage("Redirecting to sign-in page...");
    setShowToast(true);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "question" ? "Post a UPSC Question" : "Post a News Article"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isUserLoggedIn ? (
          <div className="text-center">
            <p>You need to sign in to post a question or article.</p>
            <Button variant="primary" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
        ) : mode === "question" ? (
          <UPSCQuestionForm
            googleId={user._id}
            name={user.name}
            handleClose={handleClose} // ✅ Pass close function
          />
        ) : (
          <NewsForm
            userId={user._id}
            name={user.name}
            handleClose={handleClose} // ✅ Pass close function
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="info"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Modal>
  );
};

export default PostModal;
