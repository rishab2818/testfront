import React from "react";

const AnecdoteQuotes = ({ explainers }) => {
  const randomRow = explainers[Math.floor(Math.random() * explainers.length)] || {};
  
  return (
    <div className="anecdote-section">
      <h2 className="section-title">Daily Anecdote & Quotes</h2>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4>Anecdote</h4>
          <p className="card-text">{randomRow.Anecdote || "Loading..."}</p>
          
          <h4 className="mt-4">Inspiring Quotes</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">
              {randomRow["Quote 1"] || "Loading quote 1..."}
            </li>
            <li className="list-group-item border-0">
              {randomRow["Quote 2"] || "Loading quote 2..."}
            </li>
            <li className="list-group-item border-0">
              {randomRow["Quote 3"] || "Loading quote 3..."}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnecdoteQuotes;