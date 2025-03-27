import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Pagination } from 'react-bootstrap';
import { fetchPrelimsData } from '../utils/api';
import "./Profile.css"; // Import the CSS file
import { Tooltip } from "react-tooltip";
const PrelimsSection = ({ userId, profileName }) => {
  const [prelimsData, setPrelimsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const PAGE_SIZE = 5;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchPrelimsData(userId);
      setPrelimsData(data);
      setLoading(false);
    };
    getData();
  }, [userId]);

  const toggleExpand = (id) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalPages = Math.ceil(prelimsData.length / PAGE_SIZE);
  const paginatedData = prelimsData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
console.log(paginatedData,"paginatedData")
  return (
    <div className="prelims-section">
      <h2 className="text-center">Prelims Questions by {profileName}</h2>
      
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-5" />
      ) : prelimsData.length === 0 ? (
        <h2 className="text-center mt-5">No prelims questions found</h2>
      ) : (
        <>
          {paginatedData.map(item => (
            <Card key={item._id} className="mt-3 shadow-sm">
              <Card.Body>
                <Card.Title>{item.question}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Categories: {item.category.join(", ")}
                </Card.Subtitle>
                
                <div className="options-grid mb-3">
                  {['A', 'B', 'C', 'D'].map(option => (
                    <div 
                      key={option} 
                      className={`option ${item.answer?._id ? 'correct' : ''}`}
                    >
                      {option}. {item[`option${option}`]}
                    </div>
                  ))}
                </div>
                
                {item.answer && (
                  <>
                    <Card.Text className="fw-bold">Explanation:</Card.Text>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: expandedAnswers[item._id]
                          ? item.answer.content
                          : `${item.answer.content.substring(0, 150)}...`,
                      }}
                    />
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => toggleExpand(item._id)}
                    >
                      {expandedAnswers[item._id] ? "Show Less" : "Read More"}
                    </Button>
                  </>
                )}
                                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small>
                    ❤️ {item.answer.likes} Likes | ⭐{" "}
                    <span
                      data-tooltip-id="ratingTooltip"
                      data-tooltip-place="top"
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline dotted",
                      }}
                    >
                      {item?.answer.ratings?.totalVotes === 0 ||
                      item?.answer.ratings?.overallRating == null
                        ? "NA"
                        : (
                          item.answer.ratings.overallRating /
                          item.answer.ratings.totalVotes
                          ).toFixed(1)}
                    </span>
                    <Tooltip id="ratingTooltip">
                      <div>
                        <p>
                          📚 Structure Clarity:{" "}
                          {item?.answer.ratings?.structureClarity ?? "NA"}
                        </p>
                        <p>
                          ✅ Factual Accuracy:{" "}
                          {item?.answer.ratings?.factualAccuracy ?? "NA"}
                        </p>
                        <p>
                          🎤 Presentation:{" "}
                          {item?.answer.ratings?.presentation ?? "NA"}
                        </p>
                        <p>
                          🔍 Depth of Analysis:{" "}
                          {item?.answer.ratings?.depthOfAnalysis ?? "NA"}
                        </p>
                        <p>
                          🎯 Relevance to Question:{" "}
                          {item?.answer.ratings?.relevanceToQuestion ?? "NA"}
                        </p>
                        <p>
                          Total Votes: {item?.answer.ratings?.totalVotes ?? "NA"}
                        </p>
                      </div>
                    </Tooltip>
                  </small>
                </div>
              </Card.Body>
            </Card>
          ))}
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)} 
                />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                <Pagination.Next 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)} 
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrelimsSection;