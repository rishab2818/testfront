import React from "react";

const PrelimsSyllabus = () => {
  return (
    <div className="syllabus-section">
      <h2 className="section-title">UPSC Prelims Syllabus</h2>
      <div className="syllabus-content">
        {/* Add your prelims syllabus content here */}
        <h4>General Studies Paper I</h4>
        <ul>
          <li>Current events of national and international importance</li>
          <li>History of India and Indian National Movement</li>
          <li>Indian and World Geography</li>
          <li>Indian Polity and Governance</li>
          <li>Economic and Social Development</li>
          <li>General issues on Environmental Ecology</li>
          <li>General Science</li>
        </ul>
        
        <h4>General Studies Paper II (CSAT)</h4>
        <ul>
          <li>Comprehension</li>
          <li>Interpersonal skills including communication skills</li>
          <li>Logical reasoning and analytical ability</li>
          <li>Decision-making and problem-solving</li>
          <li>General mental ability</li>
        </ul>
      </div>
    </div>
  );
};

export default PrelimsSyllabus;