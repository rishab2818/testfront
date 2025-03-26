import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Star } from "react-feather";
import { submitRatingAPI } from "../utils/api";
const RatingModal = ({ isOpen, onClose, onSubmit, ratingId,}) => {
  const [ratings, setRatings] = useState({
    structureClarity: 0,
    factualAccuracy: 0,
    presentation: 0, // Fixed key to match backend
    depthOfAnalysis: 0,
    relevanceToQuestion: 0,
    overallRating: 0,
    _id:ratingId.user
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRating = (criteria, value) => {
    setRatings((prev) => ({ ...prev, [criteria]: value }));
  };

  const submitRating = async () => {
    setLoading(true);
    setError(null);

    try {
      await submitRatingAPI(ratingId.answerId, ratings);

      onSubmit?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate This Answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {[
          { label: "Relevance to Question", key: "relevanceToQuestion" },
          { label: "Structural Clarity", key: "structureClarity" },
          { label: "Factual Accuracy", key: "factualAccuracy" },
          { label: "Presentation", key: "presentation" },
          { label: "Depth of Analysis", key: "depthOfAnalysis" },
          { label: "Overall Rating", key: "overallRating" },
        ].map(({ label, key }) => (
          <div
            key={key}
            className="d-flex align-items-center justify-content-between mb-3"
          >
            <span className="text-capitalize">{label}:</span>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="mx-1 cursor-pointer"
                  color={ratings[key] >= star ? "#FFD700" : "#ccc"}
                  fill={ratings[key] >= star ? "#FFD700" : "none"}
                  onClick={() => handleRating(key, star)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleRating(key, star);
                    }
                  }}
                  aria-label={`Rate ${label} ${star} star${
                    star > 1 ? "s" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={submitRating} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RatingModal;
