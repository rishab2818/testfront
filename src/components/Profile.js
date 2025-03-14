import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  fetchProfileAPI,
  fetchAuthorAnswersAPI,
  updateProfileAPI,
  deleteAnswerAPI,
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
import "./Profile.css"; // Import the CSS file

const includePrivate = true;
const Profile = () => {
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
  const handleShowEditModal = () => {
    setEditProfile({
      description: profile?.description || "",
      instagram: profile?.instagram || "",
      linkedin: profile?.linkedin || "",
      twitter: profile?.twitter || "",
    });
    setShowEditModal(true);
  };

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
      if (!googleId) return;

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
  }, []);

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
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

  const nextPage = () => {
    if (indexOfLastAnswer < answers.length) setCurrentPage(currentPage + 1);
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

      {/* Answers Section */}
      <h2 className="text-center">Answers by {profile?.name}</h2>
      {answers.length === 0 ? (
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
                    ❤️ {answer.likedBy?.filter(Boolean).length || 0} Likes
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
              Page {currentPage} of {Math.ceil(answers.length / answersPerPage)}
            </span>
            <Button
              variant="outline-secondary"
              onClick={nextPage}
              disabled={indexOfLastAnswer >= answers.length}
            >
              Next
            </Button>
          </div>
        </>
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
