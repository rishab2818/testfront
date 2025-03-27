import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Alert, Button,Pagination  } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import PrelimsAnswerForm from "./PrelimsAnswerForm";

import {
  likeAnswerAPI,
  getPrelimsDetails
} from "../utils/api";
import AuthContext from "../context/AuthContext";
import { Toast, ToastContainer } from "react-bootstrap";
import RatingModal from "./RatingModal";
import { Tooltip } from "react-tooltip";
import "./image.css";

const PAGE_SIZE = 5;
const CHAR_LIMIT = 250;
const sourcePrivate = false;

const PrelimsDetail = ({ mode, selectedCategory }) => {
  const { questionId } = useParams();
  const { user } = useContext(AuthContext);
  const [prelimsData, setPrelimsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newAnswer, setNewAnswer] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [ratingId, setRatingId] = useState({
    userid: null,
    answerId: null,
  });


  useEffect(() => {
    const loadPrelimsDetails = async () => {
      setLoading(true);
      try {
        const data = await getPrelimsDetails(questionId);
        console.log(data, "data is");
        setPrelimsData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPrelimsData(null);
      } finally {
        setLoading(false);
      }
    };
  
    loadPrelimsDetails();
  }, [questionId, newAnswer]);

  const handleLike = async (answerId) => {
    if (!user) {
      setToastMessage("Please login to like this answer");
      setShowToast(true);
      return;
    }
    try {
      const response = await likeAnswerAPI(answerId, user?._id);
      const updatedAnswers = prelimsData?.answers.map((ans) =>
        ans._id === answerId ? { ...ans, likes: response.likes } : ans
      );
      setPrelimsData({ ...prelimsData, answers: updatedAnswers });
      setToastMessage("Liked successfully!");
      setShowToast(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setToastMessage("You have already liked this answer.");
        setShowToast(true);
      } else {
        setToastMessage("Failed to like answer. Try again later.");
        setShowToast(true);
      }
    }
  };

  const toggleExpand = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };




  const handleOpenModal = (answerId) => {
    if (!user) {
      setToastMessage("Please login to rate this answer");
      setShowToast(true);
      return;
    }
    setRatingId({ user: null, answerId: answerId });
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleRatingSubmit = () => {
    setShowToast(true);
    setToastMessage("Rating Submitted.");
  };

  const paginatedAnswers = prelimsData?.answers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(prelimsData?.answers.length / PAGE_SIZE);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!prelimsData)
    return <h2 className="text-center mt-5">Question Not Found</h2>;

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col lg={12} xs={12}>
          <Card className="border-0 shadow-none bg-transparent">
            <Card.Body>
              <Card.Title>{prelimsData?.prelimsQuestion.question}</Card.Title>
              <Card.Text>
                <span
                  style={{
                    fontWeight: 490,
                    color: "#777",
                    fontSize: "1rem",
                  }}
                >
                  Category: {prelimsData?.prelimsQuestion.category.join(", ")}
                </span>
              </Card.Text>

              {/* Display MCQ options if they exist */}
              {prelimsData?.prelimsQuestion.optionA && (
                <div className="mt-3">
                  <h5>Options:</h5>
                  <ul className="list-unstyled">
                    <li>A. {prelimsData?.prelimsQuestion.optionA}</li>
                    <li>B. {prelimsData?.prelimsQuestion.optionB}</li>
                    <li>C. {prelimsData?.prelimsQuestion.optionC}</li>
                    <li>D. {prelimsData?.prelimsQuestion.optionD}</li>
                  </ul>
                </div>
              )}

              {user && (
                <Button
                  variant="outline-primary"
                  onClick={() => setShowModal(true)}
                >
                  Write Your Answer
                </Button>
              )}

              <h5 className="mt-4">Answers:</h5>
              {paginatedAnswers.length > 0 ? (
                paginatedAnswers.map((ans) => (
                  <Card key={ans._id} className="mt-2">
                    <Card.Body>
                      <Card.Text>
                        <div
                          className="question-card"
                          dangerouslySetInnerHTML={{
                            __html: expandedAnswers[ans._id]
                              ? ans.content
                              : `${ans.content.slice(0, CHAR_LIMIT)}...`,
                          }}
                        />
                        {ans.content.length > CHAR_LIMIT && (
                          <Button
                            variant="link"
                            className="p-0 ms-1"
                            onClick={() => toggleExpand(ans._id)}
                          >
                            {expandedAnswers[ans._id] ? "Show Less" : "Read More"}
                          </Button>
                        )}
                      </Card.Text>

                      <Card.Text>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#777",
                            fontSize: "1rem",
                          }}
                        >
                          Author:{" "}
                          {ans.author === "Anonymous" ? (
                            <span>Anonymous</span>
                          ) : (
                            <Link
                              to={`/author/${ans.userId}/${
                                user?.userId === ans.userId
                              }`}
                              state={{ author: ans }}
                              className="text-decoration-none"
                              style={{
                                color: "inherit",
                                fontWeight: "inherit",
                                fontSize: "inherit",
                              }}
                            >
                              {ans.author}
                            </Link>
                          )}{" "}
                          | ❤️ {ans.likes} | ⭐{" "}
                          <span
                            data-tooltip-id="ratingTooltip"
                            data-tooltip-place="top"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline dotted",
                            }}
                          >
                            {ans?.ratings?.totalVotes === 0 ||
                            ans?.ratings?.overallRating == null
                              ? "NA"
                              : (
                                  ans.ratings.overallRating /
                                  ans.ratings.totalVotes
                                ).toFixed(1)}
                          </span>
                          <Tooltip id="ratingTooltip">
                            <div>
                              <p>
                                Structure Clarity:{" "}
                                {ans?.ratings?.structureClarity ?? "NA"}
                              </p>
                              <p>
                                Factual Accuracy:{" "}
                                {ans?.ratings?.factualAccuracy ?? "NA"}
                              </p>
                              <p>
                                Presentation:{" "}
                                {ans?.ratings?.presentation ?? "NA"}
                              </p>
                              <p>
                                Depth of Analysis:{" "}
                                {ans?.ratings?.depthOfAnalysis ?? "NA"}
                              </p>
                              <p>
                                Relevance to Question:{" "}
                                {ans?.ratings?.relevanceToQuestion ?? "NA"}
                              </p>
                              <p>
                                Total Votes: {ans?.ratings?.totalVotes ?? "NA"}
                              </p>
                            </div>
                          </Tooltip>
                        </span>
                      </Card.Text>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleLike(ans._id)}
                      >
                        <FaHeart /> Like
                      </Button>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleOpenModal(ans._id)}
                        >
                          ⭐ Rate Answer
                        </Button>

                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted">No answers yet.</p>
              )}

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="me-2"
                  >
                    Previous
                  </Button>

                  <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="ms-2"
                  >
                    Next
                  </Button>
                </div>
              )}

            </Card.Body>
          </Card>
        </Col>


      </Row>

      <PrelimsAnswerForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        question={prelimsData?.prelimsQuestion}
        sourcePrivate={sourcePrivate}
        setNewAnswer={setNewAnswer}
      />
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
      <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRatingSubmit}
        ratingId={ratingId}
      />
    </div>
  );
};

export default PrelimsDetail;