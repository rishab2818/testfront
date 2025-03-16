import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Alert, Pagination } from "react-bootstrap";
import { fetchQuestionsAPI, fetchFollowerQuestionsAPI } from "../utils/api"; // ✅ Import API function
import AuthContext from "../context/AuthContext"; // ✅ For logged-in user context
import "./image.css"; // Import the CSS file
const QuestionList = ({ mode, selectedCategory, filterType, refresh }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const { user } = useContext(AuthContext); // ✅ Access logged-in user
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true); // ✅ Always set loading to true before fetching new data
      setError(null); // ✅ Reset error when fetching new data

      try {
        let data = [];
        if (filterType === "all") {
          data = await fetchQuestionsAPI(mode);
        } else {
          data = await fetchFollowerQuestionsAPI(mode, user?._id);
          //update backend..to bored rite now
          const filteredData = data.filter((item) =>
            mode === "question" ? item.type === "upsc" : item.type === "news"
          );
          data = filteredData;
        }

        setQuestions(data);
      } catch (err) {
        setError(err.message);
        setQuestions([]); // ✅ Clear previous data on error
      } finally {
        setLoading(false); // ✅ Always stop loading after fetch
      }
    };

    loadQuestions();
  }, [mode, filterType, selectedCategory, refresh]);

  if (!loading && !error && questions.length === 0) {
    return (
      <Alert variant="info" className="mt-4 text-center">
        No questions found.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="info" className="mt-4 text-center">
        {error}
      </Alert>
    );
  }

  // **Filter Questions by Selected Category**
  const filteredQuestions =
    selectedCategory === "All"
      ? questions
      : questions.filter((q) => q.category.includes(selectedCategory));

  // **Pagination Logic**
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredQuestions.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <Row className="g-3">
        {currentPosts.map((q) => (
          <Col key={q._id} xs={12} md={6} lg={4}>
            <Card className="shadow-sm d-flex flex-column h-100">
              <Card.Body className="d-flex flex-column flex-grow-1">
                <Card.Title title={q.title}>
                  {q.title.length > 100
                    ? q.title.slice(0, 100) + "..."
                    : q.title}
                </Card.Title>

                <Card.Text>
                  <span
                    style={{
                      fontWeight: 490,
                      color: "#777",
                      fontSize: "0.95rem",
                    }}
                  >
                    Category: {q.category.join(", ")}
                  </span>
                </Card.Text>

                {q.topAnswer ? (
                  <>
                    <Card.Text>
                      <span
                        className="question-card"
                        dangerouslySetInnerHTML={{
                          __html:
                            q.topAnswer.content
                              .split(" ")
                              .slice(0, 20)
                              .join(" ") + "...",
                        }}
                      />
                    </Card.Text>
                    <Card.Text>
                      <span
                        style={{
                          fontWeight: 490,
                          color: "#777",
                          fontSize: "1rem",
                        }}
                      >
                        Author:{" "}
                        <Link
                          to={`/author/${q.topAnswer.userId}/${
                            user?.userId === q.topAnswer.userId
                          }`}
                          state={{ author: q.topAnswer }}
                          className="text-decoration-none"
                          style={{
                            color: "inherit", // Inherit the color from the parent span
                            fontWeight: "inherit", // Inherit the font weight
                            fontSize: "inherit", // Inherit the font size
                          }}
                        >
                          {q.topAnswer.author}
                        </Link>{" "}
                        | ❤️ {q.topAnswer.likes} | ⭐{" "}
                        {q.topAnswer?.ratings?.totalVotes === 0 ||
                        q.topAnswer?.ratings?.overallRating == null
                          ? "NA"
                          : (
                              q.topAnswer.ratings.overallRating /
                              q.topAnswer.ratings.totalVotes
                            ).toFixed(1)}
                      </span>
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text className="text-muted">No answers yet</Card.Text>
                )}

                {/* Push button to bottom */}
                <div className="mt-auto">
                  <Link to={`/question/${q._id}`} className="outline-primary">
                    Read More
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      <Pagination className="mt-4 justify-content-center">
        {Array.from(
          { length: Math.ceil(filteredQuestions.length / postsPerPage) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
};

export default QuestionList;
