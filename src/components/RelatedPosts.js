import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";

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
                      fontSize: "0.85 rem",
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
                    | ❤️ {q.topAnswer.likes}
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
