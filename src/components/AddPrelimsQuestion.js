import React, { useState, useContext } from "react";
import { Button, Modal, Form, Toast } from "react-bootstrap";
import "./questionmodal.css"; // Import the CSS file
import { addPrelimsQuestion } from "../utils/api.js";
import AuthContext from "../context/AuthContext";
const upscSubjects = [
  "History",
  "Geography",
  "Polity",
  "Economics",
  "Science & Tech",
  "Environment",
  "International Relations",
];

const AddPrelimsQuestion = ({ showModal, setShowModal, fetchQuestions }) => {
  const { user } = useContext(AuthContext);
  const [newQuestion, setNewQuestion] = useState({
    userId: user?._id || null,
    author: user?.name || null,
    question: "",
    category: [],
    options: {
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
    },
    groupId: null, // Optional
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({
      ...newQuestion,
      options: { ...newQuestion.options, [name]: value },
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewQuestion({ ...newQuestion, category: selectedOptions });
  };
  const handleSubmit = async () => {
    if (
      !newQuestion.category.length || // Check if category is selected
      !newQuestion.question.trim() || // Check if question is provided
      !newQuestion.options.optionA.trim() || // Check if Option A is provided
      !newQuestion.options.optionB.trim() || // Check if Option B is provided
      !newQuestion.options.optionC.trim() || // Check if Option C is provided
      !newQuestion.options.optionD.trim() // Check if Option D is provided
    ) {
      setToastMessage("Category, question, and all options are required.");
      setShowToast(true);
      return; // Stop further execution if validation fails
    }
    const result = await addPrelimsQuestion(newQuestion); // Call the utility function
    setToastMessage(result.message);
    setShowToast(true);

    if (result.success) {
      setShowModal(false);
      fetchQuestions(); // Refresh the questions list
      setNewQuestion({
        userId: user?._id || null, // Assuming you have a way to get the userId
        author: user?.name || null,
        question: "",
        category: [],
        options: {
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
        },
        groupId: null, // Optional
      });
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg" // Default size for larger screens
        dialogClassName="modal-compact" // Custom class for additional styling
      >
        <Modal.Header closeButton style={{ padding: "1rem" }}>
          <Modal.Title style={{ fontSize: "1.25rem" }}>
            Add New Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "70vh", overflowY: "auto", padding: "1rem" }}
        >
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "0.9rem" }}>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="question"
                value={newQuestion.question}
                onChange={handleQuestionChange}
                size="sm" // Smaller input size
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                Category
              </Form.Label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "8px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                {upscSubjects.map((subject, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`category-${index}`}
                    label={subject}
                    value={subject}
                    checked={newQuestion.category.includes(subject)}
                    onChange={(e) => {
                      const selectedCategories = e.target.checked
                        ? [...newQuestion.category, e.target.value]
                        : newQuestion.category.filter(
                            (cat) => cat !== e.target.value
                          );
                      setNewQuestion({
                        ...newQuestion,
                        category: selectedCategories,
                      });
                    }}
                    style={{ fontSize: "0.9rem" }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "0.9rem" }}>Option A</Form.Label>
              <Form.Control
                as="textarea"
                name="optionA"
                rows={1}
                value={newQuestion.options.optionA}
                onChange={handleOptionChange}
                size="sm" // Smaller input size
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "0.9rem" }}>Option B</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                name="optionB"
                value={newQuestion.options.optionB}
                onChange={handleOptionChange}
                size="sm" // Smaller input size
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "0.9rem" }}>Option C</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                name="optionC"
                value={newQuestion.options.optionC}
                onChange={handleOptionChange}
                size="sm" // Smaller input size
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "0.9rem" }}>Option D</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                name="optionD"
                value={newQuestion.options.optionD}
                onChange={handleOptionChange}
                size="sm" // Smaller input size
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="w-100"
              size="sm"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#17a2b8",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default AddPrelimsQuestion;
