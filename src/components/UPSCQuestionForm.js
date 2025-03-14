import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import {
  Form,
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
} from "react-bootstrap";
import { createPostWithAnswer } from "../utils/api";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
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

const UPSCQuestionForm = ({ googleId, name, handleClose }) => {
  const [subject, setSubject] = useState("Select Subject");
  const [context, setContext] = useState("");
  const [requirements, setRequirements] = useState("");
  const [question, setQuestion] = useState(""); // ✅ User can enter question manually
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);

  const generateQuestion = async () => {
    if (subject === "Select Subject") {
      setToastMessage("Select Subject Atleast!!");
      setShowToast(true);
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/ai/generate-question",
        {
          subject: subject !== "Select Subject" ? subject : undefined,
          topic: context.trim() || undefined,
          mergedTopics: requirements.trim() || undefined,
        }
      );
      setQuestion(data.question);
    } catch (error) {
      setToastMessage("Failed to generate question. Please try again");
      setShowToast(true);
      console.error("Generation Error:", error);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    if (subject === "Select Subject") {
      setToastMessage("Please select a subject before submitting.");
      setShowToast(true);
      return;
    }
    if (!question.trim()) {
      setToastMessage("Please enter a question before submitting.");
      setShowToast(true);
      return;
    }
    if (!answer.trim()) {
      setToastMessage("Answer cannot be empty!");
      setShowToast(true);
      return;
    }

    const payload = {
      _id: googleId,
      title: question,
      categories: [subject],
      type: "upsc",
      content: answer,
      isPrivate: !isPublic,
      author: name,
    };

    try {
      await createPostWithAnswer(payload);
      setToastMessage("Submitted Successfully!");
      setShowToast(true);

      // ✅ Clear all fields
      setSubject("Select Subject");
      setContext("");
      setRequirements("");
      setQuestion("");
      setAnswer("");
      setIsPublic(true);

      // ✅ Close modal after submission
      handleClose();
    } catch (error) {
      console.error("Submission Error:", error);
      setToastMessage("Failed to submit. Please try again");
      setShowToast(true);
    }
  };
  useEffect(() => {
    let timer;
    if (isRunning && startTime) {
      timer = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const seconds = String(diff % 60).padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  return (
    <Form>
      {/* Subject Selection */}
      <Form.Group className="mb-3 d-flex align-items-center justify-content-between">
        <DropdownButton
          title={subject}
          variant="outline-primary"
          onSelect={(eventKey) => setSubject(eventKey)}
        >
          {upscSubjects.map((subj) => (
            <Dropdown.Item key={subj} eventKey={subj}>
              {subj}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        {/* Start/Stop Timer Button & Timer Display */}
        <div className="d-flex align-items-center gap-2">
          <Button
            variant={isRunning ? "outline-danger" : "outline-success"}
            onClick={toggleTimer}
          >
            {isRunning ? "Stop Timer ⏹️" : "Start Timer ⏳"}
          </Button>
          <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
            {elapsedTime}
          </span>
        </div>
      </Form.Group>

      {/* Context Field (Optional) */}
      <Form.Group className="mb-3">
        <Form.Label>Question Context (Optional)</Form.Label>
        <Form.Control
          type="text"
          placeholder="E.g., Climate Change, GST Policy"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </Form.Group>

      {/* Additional Requirements (Optional) */}
      <Form.Group className="mb-3">
        <Form.Label>Additional Requirements (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="E.g., Use recent case studies"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
      </Form.Group>

      {/* Generate Question Button */}
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={generateQuestion}
      >
        Generate Question
      </Button>

      {/* Question Input (Editable) */}
      <Form.Group className="mb-3">
        <Form.Label>Question</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Write or edit your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </Form.Group>

      {/* Answer Editor */}
      <Form.Group className="mb-3">
        <Form.Label>Answer</Form.Label>
        <ReactQuill
          value={answer}
          onChange={setAnswer}
          style={{
            height: "200px",
            display: "flex",
            flexDirection: "column",
          }}
        />
      </Form.Group>

      {/* Privacy Toggle */}
      <Form.Group className="mb-3">
        <InputGroup>
          <InputGroup.Text>Privacy:</InputGroup.Text>
          <Button
            variant={isPublic ? "success" : "primary"}
            onClick={() => setIsPublic(!isPublic)}
          >
            <Button
              variant={isPublic ? "success" : "primary"} // Changed "danger" to "warning" for a softer look
              onClick={() => setIsPublic(!isPublic)}
            >
              {isPublic ? "Public 👁️‍🗨️" : "Private 🔐"}
            </Button>
          </Button>
        </InputGroup>
      </Form.Group>

      {/* Submit Button */}
      <Button variant="outline-primary" onClick={handleSubmit}>
        Submit
      </Button>
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
    </Form>
  );
};

export default UPSCQuestionForm;
