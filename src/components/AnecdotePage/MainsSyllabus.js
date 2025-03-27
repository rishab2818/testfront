import React from "react";

const MainsSyllabus = () => {
  return (
    <div className="syllabus-section">
      <h2 className="section-title">UPSC Mains Syllabus & Recommended Books</h2>
      <p>Welcome aspirant! Here is a detailed breakdown of the UPSC Mains syllabus along with recommended books to guide your preparation.</p>
      
      <div className="syllabus-content">
        <h3>Qualifying Papers</h3>
        <h4>Paper A: Indian Language</h4>
        <p>This paper tests basic language skills in one of the languages listed in the Eighth Schedule of the Constitution.</p>
        <ul>
          <li>Comprehension of given passages</li>
          <li>Precis Writing</li>
          <li>Usage and Vocabulary</li>
          <li>Short Essays</li>
          <li>Translation (English to chosen language and vice-versa)</li>
        </ul>
        <p><strong>Recommended Books:</strong> NCERT Class 10 & 12 Grammar Books, Language-specific grammar guides</p>

        <h4>Paper B: English</h4>
        <p>Tests the candidate’s ability to read, understand, and express themselves effectively in English.</p>
        <ul>
          <li>Comprehension of given passages</li>
          <li>Precis Writing</li>
          <li>Usage and Vocabulary</li>
          <li>Short Essays</li>
        </ul>
        <p><strong>Recommended Books:</strong> Wren & Martin’s English Grammar, Word Power Made Easy - Norman Lewis</p>

        <h3>Paper I: Essay</h3>
        <p>Aspirants must write essays on multiple topics, demonstrating clear, concise, and structured thinking.</p>
        <p><strong>Recommended Books:</strong> "Essay Paper for Civil Services" by Nitin Singhania, Previous Year UPSC Essays</p>
        
        <h3>Paper II: General Studies I</h3>
        <ul>
          <li>Indian Heritage & Culture – NCERT Fine Arts, "Indian Art & Culture" by Nitin Singhania</li>
          <li>Modern Indian History – Spectrum’s "A Brief History of Modern India"</li>
          <li>Freedom Struggle – Bipin Chandra’s "India’s Struggle for Independence"</li>
          <li>Post-Independence Consolidation – "India Since Independence" by Bipin Chandra</li>
          <li>World History – "History of the World" by Arjun Dev</li>
          <li>Indian Society – NCERT Sociology, IGNOU material</li>
          <li>Geography – G.C. Leong’s "Certificate Physical Geography", NCERT Class 11 & 12 Geography</li>
        </ul>

        <h3>Paper III: General Studies II</h3>
        <ul>
          <li>Indian Constitution – Laxmikanth’s "Indian Polity"</li>
          <li>Parliament & Judiciary – D.D. Basu’s "Introduction to the Constitution of India"</li>
          <li>Welfare Schemes – Government websites, Yojana & Kurukshetra Magazines</li>
          <li>International Relations – "India’s Foreign Policy" by Rajiv Sikri</li>
        </ul>

        <h3>Paper IV: General Studies III</h3>
        <ul>
          <li>Indian Economy – Ramesh Singh’s "Indian Economy", Economic Survey</li>
          <li>Agriculture – NCERT Geography, "Agriculture at a Glance" by R.K. Sharma</li>
          <li>Science & Tech – The Hindu’s Science Section, ISRO & PIB Reports</li>
          <li>Environment – Shankar IAS Academy’s "Environment Book"</li>
          <li>Security – Ashok Kumar’s "Internal Security & Disaster Management"</li>
        </ul>

        <h3>Paper V: General Studies IV</h3>
        <ul>
          <li>Ethics & Integrity – Lexicon for Ethics, Second ARC Report</li>
          <li>Case Studies – Solve previous years’ questions</li>
        </ul>
      </div>
    </div>
  );
};

export default MainsSyllabus;