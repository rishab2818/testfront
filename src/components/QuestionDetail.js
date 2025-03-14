import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import AnswerForm from "./AnswerForm";
import RelatedPosts from "./RelatedPosts";
import {
  fetchQuestionDetailsAPI,
  fetchRelatedQuestionsAPI,
  likeAnswerAPI,
  reviewAnswerAPI,
  toggleBookmarkAPI,
} from "../utils/api";
import AuthContext from "../context/AuthContext";
import { Toast, ToastContainer } from "react-bootstrap";

const PAGE_SIZE = 5; //  Show 5 answers per page
const CHAR_LIMIT = 250; //  Limit initial content display
const sourcePrivate = false;
const QuestionDetail = ({ mode, selectedCategory }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newAnswer, setNewAnswer] = useState(false);
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]); // Track bookmarks

  useEffect(() => {
    const loadQuestionDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchQuestionDetailsAPI(id);
        setQuestion(data);
        console.log("question is", question);
        setError(null);
      } catch (err) {
        setError(err.message);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionDetails();
  }, [id, newAnswer]);

  useEffect(() => {
    const loadRelatedQuestions = async () => {
      if (!question?._id) return; // ✅ Prevent running if question._id is null or undefined

      try {
        const data = await fetchRelatedQuestionsAPI(mode);
        console.log(question, question?._id);
        const filteredData = data.filter((item) => item._id !== question._id);
        setRelatedQuestions(filteredData);
      } catch (err) {
        console.error("Error fetching related questions:", err);
      }
    };

    loadRelatedQuestions();
  }, [mode, question?._id]); // ✅ Dependency array remains the same

  const handleLike = async (answerId) => {
    try {
      const response = await likeAnswerAPI(answerId, user?.googleId);
      const updatedAnswers = question.answers.map((ans) =>
        ans._id === answerId ? { ...ans, likes: response.likes } : ans
      );
      setQuestion({ ...question, answers: updatedAnswers });
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

  const handleReview = async (questionText, answerText) => {
    const question = questionText;
    const answer = answerText;
    try {
      const response = await reviewAnswerAPI(question, answer);
      setToastMessage("Review complete..");
      setShowToast(true);
    } catch (err) {
      setToastMessage("Failed to review answer. Try again later..");
      setShowToast(true);
    }
  };

  const toggleExpand = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };
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
        <Col lg={9} xs={12}>
          <Card className="border-0 shadow-none bg-transparent">
            <Card.Body>
              <Card.Title>{question.title}</Card.Title>
              <Card.Text>
                <span
                  style={{
                    fontWeight: 490,
                    color: "#777",
                    fontSize: "1rem",
                  }}
                >
                  Category : {question.category.join(", ")}
                </span>
              </Card.Text>

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

                      <Card.Text>
                        <span
                          style={{
                            fontWeight: 500,
                            color: "#777",
                            fontSize: "1 rem",
                          }}
                        >
                          Author:{" "}
                          <Link
                            to={`/author/${ans.userId}/${
                              user?.userId === ans.userId
                            }`}
                            state={{ author: ans }}
                            className="text-decoration-none"
                            style={{
                              color: "inherit", // Inherit the color from the parent span
                              fontWeight: "inherit", // Inherit the font weight
                              fontSize: "inherit", // Inherit the font size
                            }}
                          >
                            {ans.author}
                          </Link>{" "}
                          | ❤️ {ans.likes}
                        </span>
                      </Card.Text>

                      {user && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="me-2"
                              onClick={() => handleLike(ans._id)}
                            >
                              <FaHeart /> Like
                            </Button>
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
                          </div>
                        </>
                      )}
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

        <Col lg={3} className="d-none d-lg-block">
          <RelatedPosts
            allQuestions={relatedQuestions}
            selectedCategory={selectedCategory}
          />
        </Col>
      </Row>

      <AnswerForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        question={question}
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
    </div>
  );
};

export default QuestionDetail;
