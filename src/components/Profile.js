import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  fetchProfileAPI,
  fetchAuthorAnswersAPI,
  updateProfileAPI,
  deleteAnswerAPI,
  fetchUserPoints 
} from "../utils/api"; // Import API functions
import ToastMessage from "./ToastMessage";
import { Link } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import "./Profile.css"; // Import the CSS file
import "./image.css"; // Import the CSS file
import PrelimsSection from './PrelimsSection'; // Import the PrelimsSection component
const includePrivate = true;
const Profile = ({ selectedCategory, mode }) => {
  const { user } = useContext(AuthContext);
  const googleId = user?.googleId;
  const [answers, setAnswers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    description: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
  const [updating, setUpdating] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 5;
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [filteredcategory, setfilteredcategory] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [points, setPoints] = useState(0);
  const [activeTab, setActiveTab] = useState('qna'); // 'qna' or 'prelims'
  const type = mode === "question" ? "upsc" : "news";
  const categories = selectedCategory;
  const handleShowEditModal = () => {
    setEditProfile({
      description: profile?.description || "",
      instagram: profile?.instagram || "",
      linkedin: profile?.linkedin || "",
      twitter: profile?.twitter || "",
    });
    setShowEditModal(true);
  };
  useEffect(() => {
    if (user?._id) {
      const getUserPoints = async () => {
        const userPoints = await fetchUserPoints(user._id);
        setPoints(userPoints);
      };
      getUserPoints();
    }
  }, [user?._id]);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleUpdateProfile = async () => {
    if (!googleId) return;

    setUpdating(true);
    try {
      await updateProfileAPI(googleId, editProfile);
      setShowToast(true);
      setToastMessage("Profile updated successfully!");
      const updatedProfile = {
        ...profile, // Preserve existing properties
        description: editProfile?.description || "",
        instagram: editProfile?.instagram || "",
        linkedin: editProfile?.linkedin || "",
        twitter: editProfile?.twitter || "",
      };
      setProfile(updatedProfile);
      handleCloseEditModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const loadAuthorDetails = async () => {
      if (!googleId || !user._id) return;

      try {
        const [answerData, profileData] = await Promise.all([
          fetchAuthorAnswersAPI(user._id, includePrivate),
          fetchProfileAPI(googleId),
        ]);
        setAnswers(answerData.answers || []);
        setProfile(profileData.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAuthorDetails();
  }, [googleId]);

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswerAPI(answerId);
      const filteredAnswers = answers.filter(
        (answer) => answer._id !== answerId
      );
      setAnswers(filteredAnswers);
      setShowToast(true);
      setToastMessage("✅ Answer deleted successfully!");
    } catch (err) {
      setShowToast(true);
      setToastMessage("❌ Failed to delete answer: " + err.message);
    }
  };
  useEffect(() => {
    const filtered = answers.filter(
      (item) =>
        item.type === type &&
        (selectedCategory === "All" || item.category.includes(selectedCategory))
    );
    setfilteredcategory(filtered);
    setLoadingAnswers(false);
  }, [mode, selectedCategory, answers]);
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;

  const currentAnswers = filteredcategory.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );

  const nextPage = () => {
    if (indexOfLastAnswer < filteredcategory.length)
      setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const toggleReadMore = (answerId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [answerId]: !prev[answerId], // Toggle between expanded and collapsed
    }));
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4 profile-container">
      {/* Profile Section */}
      {profile && (
        <Card className="mb-4 shadow-sm profile-card">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} md="auto" className="text-center">
                <img
                  src={profile.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  className="profile-image"
                />
              </Col>
              <Col className="text-center text-md-start">
                <h5 className="profile-name">
                  {profile.name || "Unknown Author"}
                </h5>
                <p className="profile-description">
                  Description :{" "}
                  {profile.description || "No description available"}
                </p>
                <p className="profile-followers">
                  {profile.followers.length} Followers
                </p>
                <p className="profile-following">
                  {profile.following.length} Following
                </p>
                <p className="profile-points">⭐  {points} Points</p>
                <Button
                  variant="outline-primary"
                  className="edit-profile-btn"
                  onClick={handleShowEditModal}
                >
                  Edit Profile
                </Button>
                {/* Social Links */}
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
      {/* Tab Navigation */}
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

     {/* Content Section */}
     {activeTab === 'qna' ? (
        /* QnA Answers Section */
        <>
      <h2 className="text-center">Answers by {profile?.name}</h2>
      {loadingAnswers ? (
        <Spinner animation="border" className="d-block mx-auto mt-5" />
      ) : filteredcategory.length === 0 ? (
        <h2 className="text-center mt-5">No answers found</h2>
      ) : (
        <>
          {currentAnswers.map((answer) => (
            <Card key={answer._id} className="mt-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>
                      <Link
                        to={`/question/${answer.postId}`}
                        className="text-decoration-none text-dark"
                      >
                        {answer.postTitle || "Unknown Post"}
                      </Link>
                    </Card.Title>
                    <Card.Text>
                      {expandedAnswers[answer._id] ? (
                        <>
                          <span
                            className="question-card"
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => toggleReadMore(answer._id)}
                          >
                            Read Less
                          </Button>
                        </>
                      ) : (
                        <>
                          <span
                            className="question-card"
                            dangerouslySetInnerHTML={{
                              __html: answer.content.substring(0, 200),
                            }}
                          />
                          {answer.content.length > 200 && (
                            <>
                              ...
                              <Button
                                variant="link"
                                className="p-0"
                                onClick={() => toggleReadMore(answer._id)}
                              >
                                Read More
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </Card.Text>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
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
                          🎤 Presentation:{" "}
                          {answer?.ratings?.presentation ?? "NA"}
                        </p>
                        <p>
                          🔍 Depth of Analysis:{" "}
                          {answer?.ratings?.depthOfAnalysis ?? "NA"}
                        </p>
                        <p>
                          🎯 Relevance to Question:{" "}
                          {answer?.ratings?.relevanceToQuestion ?? "NA"}
                        </p>
                        <p>
                          Total Votes: {answer?.ratings?.totalVotes ?? "NA"}
                        </p>
                      </div>
                    </Tooltip>
                  </small>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleDeleteAnswer(answer._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="outline-secondary"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-3">
              Page {currentPage} of{" "}
              {Math.ceil(filteredcategory.length / answersPerPage)}
            </span>
            <Button
              variant="outline-secondary"
              onClick={nextPage}
              disabled={indexOfLastAnswer >= filteredcategory.length}
            >
              Next
            </Button>
          </div>
        </>
      )}
        </>
      ) : (
        /* Prelims Section */
        <PrelimsSection 
          userId={user?._id} 
          profileName={profile?.name} 
        />
      )}
      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["description", "instagram", "linkedin", "twitter"].map(
              (field) => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={editProfile[field]}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        [field]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              )
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleUpdateProfile}
            disabled={updating}
          >
            {updating ? "Updating..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
      />
    </div>
  );
};

export default Profile;
