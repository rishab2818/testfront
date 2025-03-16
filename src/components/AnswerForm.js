import React, { useState, useContext, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import { submitAnswerAPI } from "../utils/api"; // ✅ Import API function
import AuthContext from "../context/AuthContext"; // ✅ Import AuthContext
import ToastMessage from "./ToastMessage";
const AnswerForm = ({
  show,
  handleClose,
  question,
  sourcePrivate,
  setNewAnswer,
  newAnswer,
}) => {
  const { user, token } = useContext(AuthContext); // ✅ Get user & token from context
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const quillRef = useRef(null);
  // ✅ Handle Answer Submission
  const handleSubmit = async () => {
    if (!answer.trim()) {
      setToastMessage("Add Answer!");
      setShowToast(true);
      return;
    }

    if (!user || !token) {
      setToastMessage("You must be logged in to submit an answer!!");
      setShowToast(true);
      return;
    }

    const payload = {
      postKey: question._id, // ✅ Post ID (Backend uses `postKey`)
      content: answer, // ✅ Answer content
      isPrivate: sourcePrivate ? sourcePrivate : !isPublic, // ✅ Public → false, Private → true
      _id: user._id, // ✅ User ID from context
      author: isAnonymous ? "Anonymous" : user.name,
    };

    try {
      setLoading(true);
      await submitAnswerAPI(payload); // ✅ Call API
      setNewAnswer(!newAnswer);
      setToastMessage("Answer Submitted Successfully!");
      setShowToast(true);
      setAnswer(""); // Clear answer
      setIsPublic(true);
      handleClose(); // Close modal
    } catch (error) {
      console.error("Submission Error:", error);
      setToastMessage("Failed to submit. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const closingModal = () => {
    handleClose();
    setAnswer("");
  };
  const imageHandler = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      const quill = quillRef.current.getEditor(); // Get Quill instance
      const range = quill.getSelection(); // Get cursor position
      if (range) {
        quill.insertEmbed(range.index, "image", imageUrl);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"], // ✅ Enables Image Button
        ],
        handlers: { image: imageHandler }, // ✅ Custom URL Upload
      },
    }),
    []
  );
  return (
    <Modal show={show} onHide={closingModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Write Your Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{question.title}</h5>
        <p className="text-muted">
          <strong>Category:</strong> {question.category.join(", ")}
        </p>

        <Form>
          {/* Answer Editor */}
          <Form.Group className="mb-3">
            <Form.Label>Your Answer</Form.Label>
            <ReactQuill
              ref={quillRef}
              modules={modules}
              value={answer}
              onChange={setAnswer}
              style={{ height: "150px", overflowY: "scroll" }}
            />
          </Form.Group>

          {/* Privacy Toggle */}
          <Form.Group className="mb-3">
            {!sourcePrivate && (
              <InputGroup>
                <InputGroup.Text>Privacy:</InputGroup.Text>

                <Button
                  variant={isPublic ? "success" : "danger"}
                  onClick={() => setIsPublic(!isPublic)}
                >
                  {isPublic ? "Public ✅" : "Private ❌"}
                </Button>
              </InputGroup>
            )}
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center gap-2">
            <Form.Label>Post as Anonymous:</Form.Label>
            <Form.Check
              type="switch"
              id="anonymous-switch"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="outline-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </Button>
        </Form>
      </Modal.Body>
      <ToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
      />
    </Modal>
  );
};

export default AnswerForm;
