import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Papa from "papaparse"; // For parsing CSV data

const AnecdotePage = () => {
  const [explainers, setExplainers] = useState([]);
  const [randomAnecdote, setRandomAnecdote] = useState("");
  const [randomQuote1, setRandomQuote1] = useState("");
  const [randomQuote2, setRandomQuote2] = useState("");
  const [randomQuote3, setRandomQuote3] = useState("");

  // Fetch explainers from Google Sheets
  useEffect(() => {
    const fetchExplainers = async () => {
      try {
        // Replace with your published Google Sheets CSV URL
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGeanBswBOTAR40iKf4zX6EcVEpJrj-MqjUS4lA3F4ESMZXl6W1hv8jugBSjOYRBWod7tC2MQaakE/pub?output=csv"
        );
        const text = await response.text();
        const result = Papa.parse(text, { header: true }); // Parse CSV to JSON
        setExplainers(result.data); // Set explainers to state

        // Randomly select a row for anecdote and quotes
        const randomRow =
          result.data[Math.floor(Math.random() * result.data.length)];
        setRandomAnecdote(randomRow.Anecdote);
        setRandomQuote1(randomRow["Quote 1"]);
        setRandomQuote2(randomRow["Quote 2"]);
        setRandomQuote3(randomRow["Quote 3"]);
      } catch (error) {
        console.error("Error fetching explainers:", error);
      }
    };

    fetchExplainers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Anecdote</h2>
          <p className="card-text">{randomAnecdote}</p>
          <hr />
          <h4 className="text-center">Inspiring Quotes</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item border-0">{randomQuote1}</li>
            <li className="list-group-item border-0">{randomQuote2}</li>
            <li className="list-group-item border-0">{randomQuote3}</li>
          </ul>
          <hr />

          {/* Recent Explainers from PIB */}
          <h4 className="text-center">Recent Explainers from PIB</h4>
          {explainers.length > 0 ? (
            explainers.map((explainer, index) => (
              <div key={index} className="mb-4">
                <h5>{explainer.Title}</h5>
                <p>{explainer.Content}</p>
              </div>
            ))
          ) : (
            <p>Loading explainers...</p>
          )}
          <hr />

          {/* Questions Based on Explainers */}
          <h4 className="text-center">Questions Based on Explainers</h4>
          {explainers.length > 0 ? (
            explainers.map((explainer, index) => (
              <div key={index} className="mb-4">
                <h5>Explainer {index + 1}</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-0">
                    <b>Mains Question 1:</b> {explainer["Question 1"]}
                  </li>
                  <li className="list-group-item border-0">
                    <b>Mains Question 2:</b> {explainer["Question 2"]}
                  </li>
                  <li className="list-group-item border-0">
                    <b>Prelims Question 3:</b> {explainer["Question 3"]}
                    <ul>
                      <li>a) {explainer.a}</li>
                      <li>b) {explainer.b}</li>
                      <li>c) {explainer.c}</li>
                      <li>d) {explainer.d}</li>
                    </ul>
                  </li>
                  <li className="list-group-item border-0">
                    <b>Prelims Question 4:</b> {explainer["Question 4"]}
                    <ul>
                      <li>a) {explainer.a}</li>
                      <li>b) {explainer.b}</li>
                      <li>c) {explainer.c}</li>
                      <li>d) {explainer.d}</li>
                    </ul>
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnecdotePage;
