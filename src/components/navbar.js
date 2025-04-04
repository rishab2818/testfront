import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { handleSuccess } from "../utils/auth";
import AuthContext from "../context/AuthContext";
import PostModal from "./PostModal"; // Import Modal
import { Toast, ToastContainer } from "react-bootstrap";
import { FaTelegramPlane } from "react-icons/fa"; // Import Telegram Icon
const Navbar = ({ mode, setMode, refresh, setRefresh }) => {
  const { user, login, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // Collapsed state
  const [showToast, setShowToast] = useState(false);
  // Toggle between "question" and "article"
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "question" ? "article" : "question"));
  };
  const handleClicks = () => {
    if (!user) {
      setShowToast(true);
    }
  };

  // Toggle Navbar Collapse

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  const handleClick = () => {
    if (refresh > 1) {
      setRefresh(refresh - 1);
    } else {
      setRefresh(refresh + 1);
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <button className="btn btn-dark mx-2 btn-light">
            <Link to="/" className="navbar-brand" onClick={handleClick}>
              🏠 Home
            </Link>
          </button>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${
              isNavCollapsed ? "" : "show"
            }`}
          >
            <ul className="navbar-nav ms-auto">
            <li className="nav-item">
  <a 
    href="https://t.me/rishab2818testfront_bot" 
    target="_blank" 
    rel="noopener noreferrer"
    className="btn btn-dark mx-2 d-flex align-items-center"
    style={{ fontSize: "1.2rem" }}
  >
    <FaTelegramPlane color="#0088cc" size={24} /> {/* Telegram Blue */}
  </a>
</li>
              <li className="nav-item nav-link text-warning">
              <Link to="/leaderboard">
                Leaderboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/prelims">
                  <button
                    className="btn btn-dark mx-2 btn-light"
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    Prelims
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/week-answer">
                  <button
                    className="btn btn-dark mx-2 btn-light"
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    Top Answer
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/anecdote">
                  <button
                    className="btn btn-dark mx-2 btn-light"
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    Syllabus
                  </button>
                </Link>
              </li>
              <li className="nav-item">
            <Link to={user ? "/group" : "#"}>
              <button
                className="btn btn-dark mx-2 btn-light"
                onClick={() => (user ? setIsNavCollapsed(true) : handleClicks())}
              >
                Group
              </button>
            </Link>
          </li>
          <li className="nav-item">
            <Link to={user ? "/bookmark" : "#"}>
              <button
                className="btn btn-dark mx-2 btn-light"
                onClick={() => (user ? setIsNavCollapsed(true) : handleClicks())}
              >
                Bookmarks
              </button>
            </Link>
          </li>

              {/*  Show Add Question/Article Button ONLY if User is Signed In */}
              {user && (
                <li className="nav-item">
                  <button
                    className="btn btn-dark mx-2 btn-light"
                    onClick={() => {
                      setShowModal(true);
                      setIsNavCollapsed(true);
                    }}
                  >
                    {mode === "question" ? "📝 New Topic" : "📝 Add Article"}
                  </button>
                </li>
              )}

              {/*  Mode Toggle (Always Visible) */}
              {/*<li className="nav-item">
                <button
                  className="btn btn-dark mx-2 btn-light"
                  onClick={toggleMode}
                >
                  {mode === "question" ? "UPSC" : "Editorial"}
                </button>
              </li>*/}

              {/* ✅ Authentication Controls */}
              <li className="nav-item ms-auto">
                {user ? (
                  <>
                    <button className="btn btn-dark mx-2 btn-light">
                      <Link
                        to="/profile"
                        className="navbar-text text-white me-2 text-decoration-none"
                        onClick={() => setIsNavCollapsed(true)}
                      >
                        Welcome, {user.name}
                      </Link>
                    </button>
                    <img
                      src={user.profilePic || user.picture}
                      alt="profile"
                      width="40"
                      className="rounded-circle"
                    />

                    <button
                      className="btn btn-outline-danger btn-light mx-2"
                      onClick={() => {
                        logout();
                        setIsNavCollapsed(true);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <GoogleLogin
                    onSuccess={(credentialResponse) =>
                      handleSuccess(credentialResponse, login)
                    }
                    onError={() => console.error("Login Failed")}
                  />
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ Show Post Modal Only for Logged-in Users */}
      {user && (
        <PostModal
          mode={mode}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
            <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="danger"
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">
            Please log in to access this feature.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Navbar;
