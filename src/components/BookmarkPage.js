import React, { useState, useEffect, useContext } from "react";
import { getBookmarksAPI, toggleBookmarkAPI } from "../utils/api"; // Ensure you have a removeBookmarkAPI function
import AuthContext from "../context/AuthContext";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./image.css"; // Import the CSS file
const PAGE_SIZE = 5; //  Show 5 answers per page
const CHAR_LIMIT = 250; //  Limit initial content display
const BookmarkPage = ({selectedCategory}) => {
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const { user } = useContext(AuthContext);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedTitles, setExpandedTitles] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const fetchBookmarks = async () => {
    try {
      if (!user?._id) return;
      const response = await getBookmarksAPI(user._id);
      setBookmarkedAnswers(response.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error.message);
    }
  };
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBookmarks(bookmarkedAnswers);
    } else {
      const filtered = bookmarkedAnswers.filter(answer => 
        answer.post.category.includes(selectedCategory)
      );
      setFilteredBookmarks(filtered);
    }
  }, [selectedCategory, bookmarkedAnswers]);
  const handleRemoveBookmark = async (answerId) => {
    try {
      await toggleBookmarkAPI(user._id, answerId);
      setBookmarkedAnswers((prev) =>
        prev.filter((ans) => ans._id !== answerId)
      );
    } catch (error) {
      console.error("Error removing bookmark:", error.message);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);
  const toggleExpandContent = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const toggleExpandTitle = (answerId) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const paginatedAnswers = filteredBookmarks?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredBookmarks?.length / PAGE_SIZE);
  return (
    <div className="container mt-4">
      <Row>
        <Col lg={12} xs={12}>
          <h4 className="mb-3">📌 Your Bookmarked Answers</h4>

          {paginatedAnswers.length > 0 ? (
            paginatedAnswers.map((ans) => (
              <Card
                key={ans._id}
                className="border-1 shadow-none bg-transparent mt-2"
              >
                <Card.Body>
                  <Card.Title>
                    {ans.post.title.length <= 100 ? (
                      ans.post.title
                    ) : expandedTitles[ans._id] ? (
                      <>
                        {ans.post.title}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpandTitle(ans._id)}
                        >
                          Read Less
                        </Button>
                      </>
                    ) : (
                      <>
                        {ans.post.title.slice(0, 100)}...
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpandTitle(ans._id)}
                        >
                          Read More
                        </Button>
                      </>
                    )}
                  </Card.Title>

                  <Card.Text>
                    {ans.content.length <= CHAR_LIMIT ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: ans.content }}
                        className="question-card"
                      />
                    ) : expandedAnswers[ans._id] ? (
                      <>
                        <span
                          dangerouslySetInnerHTML={{ __html: ans.content }}
                          className="question-card"
                        />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpandContent(ans._id)}
                        >
                          Read Less
                        </Button>
                      </>
                    ) : (
                      <>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ans.content.slice(0, CHAR_LIMIT),
                          }}
                          className="question-card"
                        />
                        ...
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpandContent(ans._id)}
                        >
                          Read More
                        </Button>
                      </>
                    )}
                  </Card.Text>

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                    <span className="text-muted mb-2 mb-sm-0">
                      Author: {ans.author} | ❤️ {ans.likes}
                    </span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveBookmark(ans._id)}
                    >
                      ❌ Remove Bookmark
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">No bookmarks yet.</p>
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
        </Col>
      </Row>
    </div>
  );
};

export default BookmarkPage;
