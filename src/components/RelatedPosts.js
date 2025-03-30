import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import "./image.css"; // Import the CSS file
const RelatedPosts = ({ allQuestions, selectedCategory }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!allQuestions || allQuestions.length === 0) {
    return <p className="text-muted">No related posts found.</p>;
  }

  // ✅ Filter and limit questions to 4
  const filteredQuestions =
    selectedCategory === "All"
      ? allQuestions.slice(0, 4)
      : allQuestions
          .filter((q) => q.category.includes(selectedCategory))
          .slice(0, 4);

  return (
    <div className="mt-0">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: 490,
            color: "#777",
            fontSize: "1.3rem",
          }}
        >
          {" "}
          Trending
        </span>
      </div>
      {filteredQuestions.map((q) => (
        <Card key={q._id} className="mt-2 shadow-sm">
          <Card.Body>
            <Card.Title title={q.title}>
              {" "}
              {q.title.length > 100 ? q.title.slice(0, 100) + "..." : q.title}
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
            {q.topAnswer && (
              <>
                <Card.Text>
                  <span
                    style={{
                      fontWeight: 490,
                      color: "#777",
                      fontSize: "0.95rem",
                    }}
                  >
                    Top Answer:
                  </span>{" "}
                  <span
                    className="question-card"
                    dangerouslySetInnerHTML={{
                      __html:
                        q.topAnswer.content.split(" ").slice(0, 20).join(" ") +
                        "...",
                    }}
                  />
                </Card.Text>
                <Card.Text>
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#777",
                      fontSize: "0.85rem", // Fixed space issue in fontSize
                      display: "inline-flex", // Keep everything in one line
                      alignItems: "center",
                      gap: "5px", // Adds spacing between elements
                      flexWrap: "nowrap", // Prevents wrapping
                      overflow: "hidden", // Prevents long names from breaking layout
                      textOverflow: "ellipsis",
                    }}
                  >
                    Author:{" "}
                    {q.topAnswer.author === "Anonymous" ? (
                      <span
                        style={{
                          color: "inherit",
                          fontWeight: "inherit",
                          fontSize: "inherit",
                          whiteSpace: "nowrap", // Prevents text from breaking
                          overflow: "hidden",
                          textOverflow: "ellipsis", // Adds "..." if too long
                        }}
                      >
                        Anonymous
                      </span> // ✅ Plain text if Anonymous
                    ) : (
                      <Link
                        to={`/author/${q.topAnswer.userId}/${
                          user?.userId === q.topAnswer.userId
                        }`}
                        state={{ author: q.topAnswer }}
      
                        style={{
                          color: "#007bff", // Standard link blue color
                          textDecoration: "underline", // Always show underline
  
                          fontWeight: "inherit",
                          fontSize: "inherit",
                          whiteSpace: "nowrap", // Prevents author name from breaking
                          overflow: "hidden",
                          textOverflow: "ellipsis", // Adds "..." if too long
                          cursor: "pointer", // Ensure it's clear it's clickable
                        }}
                      >
                        {q.topAnswer.author}
                      </Link>
                    )}{" "}
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
            )}
            <Button
              variant="link"
              onClick={() => navigate(`/question/${q._id}`)}
            >
              Read More
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default RelatedPosts;
