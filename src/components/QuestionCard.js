import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Badge, Container, Toast } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { voteQuestion, likePrelimsQuestion } from "../utils/api";
import { FaHeart } from "react-icons/fa";
import "./questionmodal.css";

const MAX_QUESTION_LENGTH = 150; // Limit question characters
const MAX_OPTION_LENGTH = 50; // Limit options characters

const QuestionCard = ({ question, author, category, options, likes, votes, questionId, fetchQuestions }) => {
  const { user } = useContext(AuthContext);
  const userId = user?._id || null;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [likeCount, setLikeCount] = useState(likes);
  const [expanded, setExpanded] = useState(false); // Track question expansion

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

  const handleLike = async () => {
    if (!userId) {
      setToastMessage("Sign in to like the question!");
      setShowToast(true);
      return;
    }

    const result = await likePrelimsQuestion(userId, questionId);
    if (result.success) {
      setLikeCount((prev) => prev + 1);
    } else {
      setToastMessage(result.message || "Failed to like the question!");
      setShowToast(true);
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm border-0 rounded-3 bg-white" style={{ minHeight: "320px" }}>
        <Card.Body className="p-4 d-flex flex-column">
          {/* Question & Details */}
          <Card.Title>
            {expanded || question.length <= MAX_QUESTION_LENGTH
              ? question
              : `${question.substring(0, MAX_QUESTION_LENGTH)}... `}
            {question.length > MAX_QUESTION_LENGTH && (
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Read Less" : "Read More"}
              </span>
            )}
          </Card.Title>

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
                style={{ color: "#000000" }}
              >
          <span
  className="text-truncate"
  style={{
    maxWidth: "100%", // Ensures it takes up full parent width
    overflow: "hidden", // Hides overflowing text
    textOverflow: "ellipsis", // Adds "..." if the text overflows
    whiteSpace: "nowrap", // Keeps text in a single line
    display: "block", // Ensures it behaves as a block element
  }}
>
                  {options[key].length > MAX_OPTION_LENGTH
                    ? `${options[key].substring(0, MAX_OPTION_LENGTH)}...`
                    : options[key]}
                </span>
                <Badge bg="secondary">{votes[key]}</Badge>
              </Button>
            ))}
          </div>

          {/* Like and Vote Counts */}
          <Container className="mt-4 d-flex align-items-center">
            <Button variant="outline-danger" size="sm" onClick={handleLike}>
              <FaHeart /> Like
            </Button>
            <span className="ms-3">❤️ {likeCount}</span>
            <span className="ms-3">🗳️ {votes.optionA + votes.optionB + votes.optionC + votes.optionD}</span>
          </Container>

          {/* Explanation Link */}
          <div className="mt-2 ms-2">
            <Link to={`/prelims-que/${questionId}`} className="outline-primary">
              Readfull or Explain
            </Link>
          </div>
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
