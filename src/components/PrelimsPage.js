import React, { useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Pagination,
  Toast,
  Form,
  Modal,
} from "react-bootstrap";

const PrelimsPage = () => {
  const [data, setData] = useState([
    {
      id: 1,
      createdBy: "IAS Mentor",
      subject: "Indian Polity",
      question:
        "Which article of the Indian Constitution deals with emergency provisions?",
      options: [
        { text: "Article 352", votes: Math.floor(Math.random() * 500) },
        { text: "Article 356", votes: Math.floor(Math.random() * 500) },
        { text: "Article 360", votes: Math.floor(Math.random() * 500) },
        { text: "Article 365", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 2,
      createdBy: "UPSC Guide",
      subject: "Indian Economy",
      question: "Which of the following is NOT a direct tax in India?",
      options: [
        { text: "Income Tax", votes: Math.floor(Math.random() * 500) },
        { text: "Corporate Tax", votes: Math.floor(Math.random() * 500) },
        {
          text: "Goods and Services Tax",
          votes: Math.floor(Math.random() * 500),
        },
        { text: "Wealth Tax", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 3,
      createdBy: "Civil Services Prep",
      subject: "Geography",
      question: "Which is the longest river in India?",
      options: [
        { text: "Yamuna", votes: Math.floor(Math.random() * 500) },
        { text: "Ganga", votes: Math.floor(Math.random() * 500) },
        { text: "Brahmaputra", votes: Math.floor(Math.random() * 500) },
        { text: "Godavari", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 4,
      createdBy: "UPSC Aspirant",
      subject: "History",
      question: "Who was the founder of the Maurya Empire?",
      options: [
        { text: "Chandragupta Maurya", votes: Math.floor(Math.random() * 500) },
        { text: "Ashoka", votes: Math.floor(Math.random() * 500) },
        { text: "Bindusara", votes: Math.floor(Math.random() * 500) },
        { text: "Harshavardhana", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 5,
      createdBy: "Rajya Sabha TV",
      subject: "Current Affairs",
      question: "Which organization releases the Global Hunger Index?",
      options: [
        { text: "UNICEF", votes: Math.floor(Math.random() * 500) },
        { text: "World Bank", votes: Math.floor(Math.random() * 500) },
        { text: "IFPRI", votes: Math.floor(Math.random() * 500) },
        { text: "IMF", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 6,
      createdBy: "Economic Times",
      subject: "Economy",
      question:
        "Which institution is responsible for monetary policy in India?",
      options: [
        { text: "SEBI", votes: Math.floor(Math.random() * 500) },
        { text: "NITI Aayog", votes: Math.floor(Math.random() * 500) },
        { text: "RBI", votes: Math.floor(Math.random() * 500) },
        { text: "Finance Ministry", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 7,
      createdBy: "Geography Enthusiast",
      subject: "Geography",
      question:
        "The Tropic of Cancer passes through which of these Indian states?",
      options: [
        { text: "Maharashtra", votes: Math.floor(Math.random() * 500) },
        { text: "Rajasthan", votes: Math.floor(Math.random() * 500) },
        { text: "Tamil Nadu", votes: Math.floor(Math.random() * 500) },
        { text: "Kerala", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 8,
      createdBy: "History Expert",
      subject: "History",
      question: "Who among the following wrote the book ‘Indica’?",
      options: [
        { text: "Megasthenes", votes: Math.floor(Math.random() * 500) },
        { text: "Pliny", votes: Math.floor(Math.random() * 500) },
        { text: "Ptolemy", votes: Math.floor(Math.random() * 500) },
        { text: "Aristotle", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 9,
      createdBy: "IAS Academy",
      subject: "Science & Tech",
      question: "Which is the first satellite launched by India?",
      options: [
        { text: "Aryabhata", votes: Math.floor(Math.random() * 500) },
        { text: "Bhaskara", votes: Math.floor(Math.random() * 500) },
        { text: "Rohini", votes: Math.floor(Math.random() * 500) },
        { text: "INSAT-1A", votes: Math.floor(Math.random() * 500) },
      ],
    },
    {
      id: 10,
      createdBy: "UPSC Crackers",
      subject: "Environment",
      question: "Which gas is primarily responsible for global warming?",
      options: [
        { text: "Oxygen", votes: Math.floor(Math.random() * 500) },
        { text: "Carbon Dioxide", votes: Math.floor(Math.random() * 500) },
        { text: "Hydrogen", votes: Math.floor(Math.random() * 500) },
        { text: "Nitrogen", votes: Math.floor(Math.random() * 500) },
      ],
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    createdBy: "",
    subject: "",
    question: "",
    options: ["", "", "", ""],
  });

  const questionsPerPage = 4;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = data.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleVote = (questionId, optionIndex) => {
    const updatedData = data.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map((opt, index) =>
            index === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      }
      return q;
    });
    setData(updatedData);
    setToastMessage("Answer submitted successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSubmit = () => {
    if (
      !newQuestion.createdBy ||
      !newQuestion.subject ||
      !newQuestion.question ||
      newQuestion.options.some((opt) => opt === "")
    ) {
      setToastMessage("Please fill all fields before submitting.");
      setShowToast(true);
      return;
    }

    const newEntry = {
      id: data.length + 1,
      createdBy: newQuestion.createdBy,
      subject: newQuestion.subject,
      question: newQuestion.question,
      options: newQuestion.options.map((opt) => ({ text: opt, votes: 0 })),
    };
    setData([newEntry, ...data]);
    setNewQuestion({
      createdBy: "",
      subject: "",
      question: "",
      options: ["", "", "", ""],
    });
    setShowModal(false);
    setToastMessage("Question submitted successfully!");
    setShowToast(true);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Prelims QnA Section</h2>
      <h6>
        This page is for presentation purposes only. It is a new requirement
        that will be added in the future. Currently, it is non-functional and
        exists solely for presentation
      </h6>

      <p>
        This page will function like other pages—it will appear in bookmarks,
        groups, and the user profile section. Additionally, when users click on
        a question, they can provide insights or explanations on why a specific
        option is correct, similar to how Q&A interactions are handled elsewhere
      </p>
      {/* Button to Open Modal */}
      <div className="text-center mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Question
        </Button>
      </div>

      {/* Questions List */}
      <Row>
        {currentQuestions.map((q) => (
          <Col key={q.id} xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{q.question}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Created by: {q.createdBy} | Subject: {q.subject}
                </Card.Subtitle>
                {q.options.map((opt, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className="d-block w-100 text-start my-2"
                    onClick={() => handleVote(q.id, index)}
                  >
                    {opt.text} - {opt.votes} votes
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(Math.ceil(data.length / questionsPerPage))].map(
          (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      {/* Modal for Adding New Question */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                name="createdBy"
                value={newQuestion.createdBy}
                onChange={handleQuestionChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={newQuestion.subject}
                onChange={handleQuestionChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={newQuestion.question}
                onChange={handleQuestionChange}
              />
            </Form.Group>
            {newQuestion.options.map((opt, index) => (
              <Form.Group key={index} className="mb-2">
                <Form.Label>Option {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </Form.Group>
            ))}
            <Button variant="primary" onClick={handleSubmit} className="w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
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
    </Container>
  );
};

export default PrelimsPage;
