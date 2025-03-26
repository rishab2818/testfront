import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./image.css"; // Import the CSS file

const TopAnswersOfWeek = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopAnswers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://testback-wozi.onrender.com/answers/week-answers"
        );
        if (!response.ok) {
          throw new Error("Nothing Here Yet!!");
        }
        const data = await response.json();
        setAnswers(data.data); // Assuming the API returns { success, message, data }
      } catch (err) {
        setError(err.message);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnswers();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    );
  }

  if (!loading && !error && answers.length === 0) {
    return (
      <Alert variant="info" className="mt-4 text-center">
        No top answers found for this week.
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Top Answers of the Week</h3>
      <Row className="g-3">
        {answers.map((answer) => (
          <Col key={answer._id} xs={12} md={6} lg={4}>
            <Card className="shadow-sm d-flex flex-column h-100">
              <Card.Body className="d-flex flex-column flex-grow-1">
                <Card.Title title={answer.postTitle}>
                  {answer.postTitle.length > 100
                    ? answer.postTitle.slice(0, 100) + "..."
                    : answer.postTitle}
                </Card.Title>

                <Card.Text>
                  <span
                    style={{
                      fontWeight: 490,
                      color: "#777",
                      fontSize: "0.95rem",
                    }}
                  >
                    Category: {answer.postCategory.join(", ")}
                  </span>
                </Card.Text>

                <Card.Text>
                  <span
                    className="question-card"
                    dangerouslySetInnerHTML={{
                      __html:
                        answer.content.split(" ").slice(0, 20).join(" ") +
                        "...",
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
                    Author: {answer.author} | ❤️ {answer.likes} | ⭐{" "}
                    {answer.ratings.totalVotes === 0 ||
                    answer.ratings.overallRating == null
                      ? "NA"
                      : (
                          answer.ratings.overallRating /
                          answer.ratings.totalVotes
                        ).toFixed(1)}
                  </span>
                </Card.Text>

                <div className="mt-auto">
                  <Link
                    to={`/question/${answer.postId}`}
                    className="outline-primary"
                  >
                    Read More
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Section: How Top Answer is Calculated */}
      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <Card.Title>How Top Answers Are Calculated</Card.Title>
          <Card.Text>
            The top answers are determined using a weighted score based on the
            following factors:
          </Card.Text>
          <ul>
            <li>
              <strong>Average Rating (40% weight)</strong>: The average of all
              rating categories (structure clarity, factual accuracy,
              presentation, depth of analysis, relevance to question, and
              overall rating).
            </li>
            <li>
              <strong>Total Votes (40% weight)</strong>: The total number of
              votes (ratings) the answer has received.
            </li>
            <li>
              <strong>Likes (20% weight)</strong>: The total number of likes the
              answer has received.
            </li>
          </ul>
          <Card.Text>The formula used to calculate the score is:</Card.Text>
          <pre className="bg-light p-3 rounded">
            <code>
              {`Score = (Average Rating * 0.4) + (Total Votes * 0.4) + (Likes * 0.2)`}
            </code>
          </pre>
          <Card.Text>
            The answers are then sorted by this score in descending order, and
            the top 3 answers are displayed.
          </Card.Text>

          {/* Tier-Based Payout Section 
          <Card.Title className="mt-4">Tier-Based Payout System</Card.Title>
          <Card.Text>
            Authors can earn payouts at the end of the month based on their
            tier, followers, and likes. The requirements are:
          </Card.Text>
          <ul>
            <li>
              <strong>Tier 1</strong>: 1000 followers and 1000 likes.
            </li>
            <li>
              <strong>Tier 2</strong>: 700 followers and 1000 likes.
            </li>
            <li>
              <strong>Tier 3</strong>: 500 followers and 1000 likes.
            </li>
          </ul>
          <Card.Text>
            Payouts are processed at the end of each month based on your tier
            and engagement metrics.
          </Card.Text>
          */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TopAnswersOfWeek;
