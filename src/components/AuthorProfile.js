import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, Spinner, Alert, Button, Row, Col } from "react-bootstrap";
import {
  fetchAuthorAnswersAPI,
  fetchProfilebyId,
  toggleFollowAPI,
  toggleBookmarkAPI,
  fetchUserPoints
} from "../utils/api";
import AuthContext from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AuthorProfile.css";
import ToastMessage from "./ToastMessage";
import { Tooltip } from "react-tooltip";
import "./image.css"; // Import the CSS file
import PrelimsSection from './PrelimsSection';
const PAGE_SIZE = 5; // 5 answers per page
const AuthorProfile = ({ mode, selectedCategory }) => {
  const { authoruserId, includePrivate } = useParams();
 
  const location = useLocation();
  const authorObject = location.state?.author || {};

  const [answers, setAnswers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { user } = useContext(AuthContext);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [points, setPoints] = useState(0);
  const [activeTab, setActiveTab] = useState('qna'); // 'qna' or 'prelims'
  const userId = user?._id;
  
  useEffect(() => {
    if (authoruserId) {
      const getUserPoints = async () => {
        const userPoints = await fetchUserPoints(authoruserId);
        setPoints(userPoints);
      };
      getUserPoints();
    }
  }, [authoruserId]);
  useEffect(() => {
    const loadAuthorDetails = async () => {
      if (!authoruserId) return;
      try {
        const [answerData, profileData] = await Promise.all([
          fetchAuthorAnswersAPI(authorObject.userId, includePrivate),
          fetchProfilebyId(authorObject.userId),
        ]);

        const filteredAnswers = answerData.answers.filter(
          (answer) =>
            (selectedCategory === "All" ||
              answer.category.includes(selectedCategory)) &&
            (mode === "All" ||
              (mode === "question" && answer.type === "upsc") ||
              (mode === "article" && answer.type === "news"))
        );
        const filteredAnonymous = filteredAnswers.filter(
          (ans) => ans.author !== "Anonymous"
        );

        setAnswers(filteredAnonymous || []);
        setProfile(profileData.data || null);
        if (profileData.data) {
          setIsFollowing(profileData.data.followers.includes(userId));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAuthorDetails();
  }, [authoruserId, includePrivate, mode, selectedCategory]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      const result = await toggleFollowAPI(profile._id, userId);
      setIsFollowing(result.data.following);
    } catch (error) {
      console.error("Error toggling follow status:", error.message);
    }
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
  const handleToggleExpand = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId], // Toggle the expand state
    }));
  };
  const totalPages = Math.ceil(answers.length / PAGE_SIZE);
  const paginatedAnswers = answers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4 profile-container">
      {profile && (
        <Card className="mb-4 shadow-sm profile-card">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} md="auto" className="text-center">
                <img
                  src={profile.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  className="profile-img"
                />
              </Col>
              <Col className="text-center text-md-start">
                <h5 className="profile-name">
                  {profile.name || "Unknown Author"}
                </h5>
                <p className="profile-description">
                  {profile.description || "No description available"}
                </p>
                <p className="profile-followers">
                  {profile.followers.length} Followers
                </p>
                <p className="profile-following">
                  {profile.following.length} Following
                </p>
                <p className="profile-points">⭐  {points} Points</p>
                {(!userId || profile._id !== userId) && (
  <Button
    variant={isFollowing ? "danger" : "primary"}
    onClick={() => {
      if (!userId) {
        setToastMessage("Login to follow");
        setShowToast(true);
      } else {
        handleFollow();
      }
    }}
  >
    {isFollowing ? "Unfollow" : "Follow"}
  </Button>
)}
                <div className="social-links">
                  {profile.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      <div className="tab-container mt-4">
  <div className="d-flex justify-content-center border-bottom">
    <div 
      className={`tab-item ${activeTab === 'qna' ? 'active-tab' : ''}`}
      onClick={() => setActiveTab('qna')}
    >
      QnA Answers
    </div>
    <div 
      className={`tab-item ${activeTab === 'prelims' ? 'active-tab' : ''}`}
      onClick={() => setActiveTab('prelims')}
    >
      Prelims Answers
    </div>
  </div>
</div>
{activeTab === 'qna' ? (
      /* QnA Answers Section */
      <>
      <h2 className="text-center">Answers by {profile?.name}</h2>
      {paginatedAnswers.length === 0 ? (
        <h2 className="text-center mt-5">No answers found</h2>
      ) : (
        paginatedAnswers.map((answer) => (
          <Card key={answer._id} className="mt-3 shadow-sm">
            <Card.Body>
              <Card.Title title={answer.postTitle}>
                <Link
                  to={`/question/${answer.postId}`}
                  className="text-decoration-none text-dark"
                >
                  {answer.postTitle.length > 100
                    ? answer.postTitle.slice(0, 100) + "..."
                    : answer.postTitle}
                </Link>
              </Card.Title>
              <Card.Text>
                <span
                  className="question-card"
                  dangerouslySetInnerHTML={{
                    __html: expandedAnswers[answer._id]
                      ? answer.content // Show full content if expanded
                      : answer.content.split(" ").slice(0, 20).join(" ") +
                        "...",
                  }}
                />
                <Button
                  variant="link"
                  className="read-more-btn"
                  onClick={() => handleToggleExpand(answer._id)}
                >
                  {expandedAnswers[answer._id] ? "Read Less" : "Read More"}
                </Button>
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small>
                  ❤️ {answer.likes} Likes | ⭐{" "}
                  <span
                    data-tooltip-id="ratingTooltip"
                    data-tooltip-place="top"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline dotted",
                    }}
                  >
                    {answer?.ratings?.totalVotes === 0 ||
                    answer?.ratings?.overallRating == null
                      ? "NA"
                      : (
                          answer.ratings.overallRating /
                          answer.ratings.totalVotes
                        ).toFixed(1)}
                  </span>
                  <Tooltip id="ratingTooltip">
                    <div>
                      <p>
                        📚 Structure Clarity:{" "}
                        {answer?.ratings?.structureClarity ?? "NA"}
                      </p>
                      <p>
                        ✅ Factual Accuracy:{" "}
                        {answer?.ratings?.factualAccuracy ?? "NA"}
                      </p>
                      <p>
                        🎤 Presentation: {answer?.ratings?.presentation ?? "NA"}
                      </p>
                      <p>
                        🔍 Depth of Analysis:{" "}
                        {answer?.ratings?.depthOfAnalysis ?? "NA"}
                      </p>
                      <p>
                        🎯 Relevance to Question:{" "}
                        {answer?.ratings?.relevanceToQuestion ?? "NA"}
                      </p>
                      <p>Total Votes: {answer?.ratings?.totalVotes ?? "NA"}</p>
                    </div>
                  </Tooltip>
                </small>
                {user && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      handleBookmark(answer._id, user._id, setBookmarkedAnswers)
                    }
                  >
                    🔖 Bookmark
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
      </>
    ) : (
      /* Prelims Section - uses separate component */
      <PrelimsSection 
        userId={authoruserId} 
        profileName={profile?.name} 
      />
    )}
      {/* Pagination UI */}
      {activeTab === 'qna' && totalPages > 1 && (
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

      <ToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
      />
    </div>
  );
};
export default AuthorProfile;
