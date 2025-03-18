import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; //make it browser router or something..in url has keeps coming annoying af!!
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Filters from "./components/Filters";
import QuestionList from "./components/QuestionList"; // ✅ New Component
import QuestionDetail from "./components/QuestionDetail"; // ✅ New Component
import AuthorProfile from "./components/AuthorProfile"; // ✅ Import new component
import ProfilePage from "./components/Profile";
import GroupQuestions from "./components/GroupQuestions";
import Group from "./components/Group";
import BookmarkPage from "./components/BookmarkPage";
import AnecdotePage from "./components/AnecdotePage";
import TopAnswersOfWeek from "./components/TopAnswersofWeek";
import PrelimsPage from "./components/PrelimsPage";
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [mode, setMode] = useState("question"); // 🔹 Now mode is in App.js
  const [refresh, setRefresh] = useState(1);
  return (
    <GoogleOAuthProvider clientId="590318971789-rvsf8okm3ntgnei74ckk35i5fi4fjqb6.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Navbar
            mode={mode}
            setMode={setMode}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <div className="container-fluid mt-5">
            <Filters
              filterType={filterType}
              setFilterType={setFilterType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              toggle={mode}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <QuestionList
                    mode={mode}
                    selectedCategory={selectedCategory}
                    filterType={filterType}
                    refresh={refresh}
                  />
                }
              />{" "}
              {/* ✅ Show questions */}
              <Route
                path="/question/:id"
                element={
                  <QuestionDetail
                    mode={mode}
                    selectedCategory={selectedCategory}
                  />
                }
              />{" "}
              <Route
                path="/author/:authoruserId/:includePrivate"
                element={
                  <AuthorProfile
                    mode={mode}
                    selectedCategory={selectedCategory}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    selectedCategory={selectedCategory}
                    mode={mode}
                  />
                }
              />
              <Route path="/group" element={<Group />} />
              <Route path="/groupqna/" element={<GroupQuestions />} />
              <Route path="/bookmark" element={<BookmarkPage />} />
              <Route path="/anecdote" element={<AnecdotePage />} />
              <Route path="/week-answer" element={<TopAnswersOfWeek />} />
              <Route path="/prelims" element={<PrelimsPage />} />
              {/* ✅ New Route */}
              {/* ✅ Show question details */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
