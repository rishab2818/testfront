import React from "react";

const MainsSyllabus = () => {
  return (
    <div className="syllabus-section">
      <h2 className="section-title">UPSC Mains Syllabus</h2>
      <div className="syllabus-content">
        {/* Add your mains syllabus content here */}
        <h4>Paper A: Indian Language</h4>
        <h4>Paper B: English</h4>
        <h4>Paper I: Essay</h4>
        <h4>Paper II: General Studies I</h4>
        <ul>
          <li>Indian Heritage and Culture</li>
          <li>History and Geography of the World</li>
          <li>Indian Society</li>
        </ul>
        {/* Add other papers similarly */}
      </div>
    </div>
  );
};

export default MainsSyllabus;