import React, { useContext,useState } from "react";
import { Card, Button, Badge, Row, Col, Container,Toast } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { voteQuestion } from "../utils/api";
import "./questionmodal.css"; // Import the CSS file

const QuestionCard = ({
  question,
  author,
  category,
  options,
  likes,
  votes,
  questionId,
  fetchQuestions,
}) => {
  const { user } = useContext(AuthContext);
  const userId = user?._id || null;
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const handleVote = async (option) => {
    if (!userId) {
      setToastMessage("Sign in to vote on a question!");
      setShowToast(true);
      return;
    }
    const result = await voteQuestion(userId, questionId, option);
    if (result.success) {
      fetchQuestions();
    } else {
      console.error(result.message);
    }
  };

  return (
    <>
    <Card
      className="mb-4 shadow-sm border-0 rounded-3 bg-white"
      style={{ minHeight: "300px" }}
    >
      <Card.Body className="p-4 d-flex flex-column">
        {/* Question & Details */}
        <Card.Title>{question}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted small">
          <span className="fw-semibold">Created by:</span> {author} |{" "}
          <span className="fw-semibold">Category:</span> {category.join(", ")}
        </Card.Subtitle>

        {/* Voting Buttons */}
        <div className="d-grid gap-3 mt-3 flex-grow-1">
          {Object.keys(options).map((key) => (
            <Button
              key={key}
              variant="outline-primary"
              className="d-flex justify-content-between align-items-center text-start py-2 px-3 rounded-pill vote-button"
              onClick={() => handleVote(key)}
              style={{ color: "#000000" }} // Set text color to black
            >
              <span className="text-truncate" style={{ maxWidth: "80%" }}>
                {options[key]}
              </span>
              <Badge bg="secondary">{votes[key]}</Badge>
            </Button>
          ))}
        </div>

        {/* Like and Vote Counts (Bottom of the Card) */}
        <Container className="mt-4">
          <Row>
            <Col xs="auto">❤️ {likes}</Col>
            <Col xs="auto">
              🗳️ {votes.optionA + votes.optionB + votes.optionC + votes.optionD}
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
          {/* Toast Message */}
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

export default QuestionCard;
