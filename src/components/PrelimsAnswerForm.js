import React, { useState, useContext, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form, Button, InputGroup, Modal } from "react-bootstrap";
import { addPrelimsAnswer } from "../utils/api";
import AuthContext from "../context/AuthContext";
import ToastMessage from "./ToastMessage";

const PrelimsAnswerForm = ({
  show,
  handleClose,
  question,
  sourcePrivate,
  setNewAnswer,
  newAnswer,
}) => {
  const { user, token } = useContext(AuthContext);
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const quillRef = useRef(null);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setToastMessage("Please add an answer");
      setShowToast(true);
      return;
    }
  
    if (!user || !token) {
      setToastMessage("You must be logged in to submit an answer!");
      setShowToast(true);
      return;
    }
  
    const payload = {
      userId: user._id,
      author: isAnonymous ? "Anonymous" : user.name,
      content: answer,
      prelimsQuestionId: question._id,
      isPrivate: sourcePrivate ? sourcePrivate : !isPublic,
    };
  
    try {
      setLoading(true);
      const data = await addPrelimsAnswer(payload);
  
      setNewAnswer(!newAnswer);
      setToastMessage(data.message || "Answer Submitted Successfully!");
      setShowToast(true);
      setAnswer("");
      setIsPublic(true);
      handleClose();
    } catch (error) {
      console.error("Submission Error:", error);
      setToastMessage(error.message || "Failed to submit. Please try again.");
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
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
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
          ["link", "image"],
        ],
        handlers: { image: imageHandler },
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
        <h5>{question.question}</h5>
        <p className="text-muted">
          <strong>Category:</strong> {question.category.join(", ")}
        </p>

        {/* Display MCQ options if they exist */}
        {question.optionA && (
          <Form.Group className="mb-3">
            <Form.Label>Select Correct Option:</Form.Label>
            <div className="d-flex flex-column gap-2">
  <ul className="list-group">
    {['A', 'B', 'C', 'D'].map((option) => (
      <li key={option} className="list-group-item">
        {option}. {question[`option${option}`]}
      </li>
    ))}
  </ul>
</div>

          </Form.Group>
        )}

        <Form>
          {/* Answer Editor (optional for prelims) */}
          <Form.Group className="mb-3">
            <Form.Label>Additional Explanation (Optional)</Form.Label>
            <ReactQuill
              ref={quillRef}
              modules={modules}
              value={answer}
              onChange={setAnswer}
              style={{ height: "150px", overflowY: "scroll" }}
              placeholder="Add any additional explanation or reasoning..."
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

export default PrelimsAnswerForm;