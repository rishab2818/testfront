import React from "react";

const RecentExplainers = ({ explainers }) => {
  return (
    <div className="explainers-section">
      <h2 className="section-title">Recent Explainers from PIB</h2>
      {explainers.length > 0 ? (
        explainers.slice(0, 5).map((explainer, index) => (
          <div key={index} className="card mb-3 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{explainer.Title || "Untitled"}</h5>
              <p className="card-text">{explainer.Content || "No content available"}</p>
              
              <div className="questions mt-3">
                <h6>Related Questions:</h6>
                <ul className="list-group list-group-flush">
                  {explainer["Question 1"] && (
                    <li className="list-group-item border-0">
                      <b>Mains:</b> {explainer["Question 1"]}
                    </li>
                  )}
                  {explainer["Question 3"] && (
                    <li className="list-group-item border-0">
                      <b>Prelims:</b> {explainer["Question 3"]}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading explainers...</p>
      )}
    </div>
  );
};

export default RecentExplainers;