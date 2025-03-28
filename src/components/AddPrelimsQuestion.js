import React, { useState, useContext } from "react";
import { Button, Modal, Form, Toast } from "react-bootstrap";
import "./questionmodal.css"; // Import the CSS file
import { addPrelimsQuestion } from "../utils/api.js";
import AuthContext from "../context/AuthContext";

const upscSubjects = [
  "Ancient History",
  "Medieval History",
  "Modern History",
  "Post-Independence History",
  "World History",
  "Physical Geography",
  "Indian Geography",
  "World Geography",
  "Economic Geography",
  "Indian Polity",
  "Governance & Public Policy",
  "Political Theories",
  "International Law & Organizations",
  "Indian Economy",
  "Macroeconomics & Microeconomics",
  "Banking & Finance",
  "International Economy",
  "Space & Defense Technology",
  "Biotechnology & Health",
  "Artificial Intelligence & IT",
  "Basic & Applied Science",
  "Climate Change",
  "Biodiversity & Conservation",
  "Environmental Laws & Treaties",
  "Disaster Management",
  "India's Bilateral Relations",
  "Global Institutions",
  "Geopolitical Issues",
  "Foreign Policies & Agreements",
  "Ethical Theories",
  "Public Administration Ethics",
  "Philosophy & Thinkers",
  "Case Studies & Real-Life Applications",
  "Current Affairs",
  "Government Schemes & Policies",
  "Social Issues",
  "Indian Society & Culture",
  "Internal Security",
  "Science & Disaster Management",
  "Indian Art & Culture",
  "Agriculture & Food Security",
  "Social Justice & Welfare",
  "General Life Question",
];

const AddPrelimsQuestion = ({ showModal, setShowModal, fetchQuestions }) => {
  const { user } = useContext(AuthContext);
  const [newQuestion, setNewQuestion] = useState({
    userId: user?._id || null,
    author: user?.name || null,
    question: "",
    category: [], // Array as backend expects
    options: {
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
    },
    groupId: null, // Optional
  });

  const [selectedCategory, setSelectedCategory] = useState(""); // For the dropdown selection
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
    const value = e.target.value;
    setSelectedCategory(value);
    // Store as array with single item to match backend expectation
    setNewQuestion({
      ...newQuestion,
      category: value ? [value] : [],
    });
  };

  const handleSubmit = async () => {
    if (
      newQuestion.category.length === 0 || // Check if category is selected
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
      setSelectedCategory(""); // Reset the dropdown selection
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
              <Form.Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                size="sm"
              >
                <option value="">Select a category</option>
                {upscSubjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </Form.Select>
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