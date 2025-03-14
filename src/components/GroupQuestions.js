import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import AnswerForm from "./AnswerForm";
import { fetchGroupQuestionDetailsAPI, toggleBookmarkAPI } from "../utils/api";
import { Toast, ToastContainer } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import ToastMessage from "./ToastMessage";
const sourcePrivate = true;
const PAGE_SIZE = 5; //  Show 5 answers per page
const CHAR_LIMIT = 250; //  Limit initial content display
const GroupQuestions = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const post = location.state?.post;
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]); // Track bookmarks
  const [newAnswer, setNewAnswer] = useState(true);
  useEffect(() => {
    const loadQuestionDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchGroupQuestionDetailsAPI(post._id);
        setQuestion(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionDetails();
  }, [post._id, newAnswer]);
  const handleBookmark = async (answerId, userId, setBookmarkedAnswers) => {
    try {
      const response = await toggleBookmarkAPI(userId, answerId); // Call API

      setBookmarkedAnswers(
        (prev) =>
          prev.includes(answerId)
            ? prev.filter((id) => id !== answerId) // Remove from UI state
            : [...prev, answerId] // Add to UI state
      );
      setShowToast(true);
      setToastMessage(response.data.message); // Show success message from API
    } catch (error) {
      console.error("Error bookmarking:", error);
      setShowToast(true);
      setToastMessage("Failed to bookmark.");
    }
  };

  const toggleExpand = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const paginatedAnswers = question?.answers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(question?.answers.length / PAGE_SIZE);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!question)
    return <h2 className="text-center mt-5">Question Not Found</h2>;

  return (
    <div className="container mt-4">
      <Row>
        <Col lg={12} xs={12}>
          <Card className="border-0 shadow-none bg-transparent">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>
                <span
                  style={{
                    fontWeight: 490,
                    color: "#777",
                    fontSize: "1rem",
                  }}
                >
                  Category : {post.category.join(", ")}
                </span>
              </Card.Text>

              <Button
                variant="outline-primary"
                onClick={() => setShowModal(true)}
              >
                Write Your Answer
              </Button>

              <h5 className="mt-4">Answers:</h5>
              {paginatedAnswers.length > 0 ? (
                paginatedAnswers.map((ans) => (
                  <Card key={ans._id} className="mt-2">
                    <Card.Body>
                      <Card.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: expandedAnswers[ans._id]
                              ? ans.content
                              : `${ans.content.slice(0, CHAR_LIMIT)}...`,
                          }}
                        />
                        <Button
                          variant="link"
                          className="p-0 ms-1"
                          onClick={() => toggleExpand(ans._id)}
                        >
                          {expandedAnswers[ans._id] ? "Show Less" : "Read More"}
                        </Button>
                      </Card.Text>

                      <Card.Text className="d-flex justify-content-between align-items-center">
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#777",
                            fontSize: "1rem",
                          }}
                        >
                          Author: {ans.author} | ❤️ {ans.likes}
                        </span>

                        {user && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              handleBookmark(
                                ans._id,
                                user._id,
                                setBookmarkedAnswers
                              )
                            }
                          >
                            🔖 Bookmark
                          </Button>
                        )}
                      </Card.Text>
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

      <AnswerForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        question={question}
        sourcePrivate={sourcePrivate}
        setNewAnswer={setNewAnswer}
        newAnswer={newAnswer}
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
    </div>
  );
};

export default GroupQuestions;
