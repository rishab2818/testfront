import React, { useState, useEffect } from "react";
import Papa from 'papaparse'; // Add this import
import "bootstrap/dist/css/bootstrap.min.css";
import PrelimsSyllabus from "./PrelimsSyllabus";
import MainsSyllabus from "./MainsSyllabus";
import AnecdoteQuotes from "./AnecdoteQuotes";
import RecentExplainers from "./RecentExplainers";
import "./styles.css";

const AnecdotePage = () => {
  const [explainers, setExplainers] = useState([]);
  const [activeTab, setActiveTab] = useState("anecdote");

  useEffect(() => {
    const fetchExplainers = async () => {
      try {
        const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSTGeanBswBOTAR40iKf4zX6EcVEpJrj-MqjUS4lA3F4ESMZXl6W1hv8jugBSjOYRBWod7tC2MQaakE/pub?output=csv");
        const text = await response.text();
        const result = Papa.parse(text, { header: true });
        setExplainers(result.data);
      } catch (error) {
        console.error("Error fetching explainers:", error);
      }
    };

    fetchExplainers();
  }, []);

  return (
    <div className="container mt-4 anecdote-container">
      <div className="tab-navigation mb-4">
        <button 
          className={`tab-btn ${activeTab === "prelims" ? "active" : ""}`}
          onClick={() => setActiveTab("prelims")}
        >
          Prelims Syllabus
        </button>
        <button 
          className={`tab-btn ${activeTab === "mains" ? "active" : ""}`}
          onClick={() => setActiveTab("mains")}
        >
          Mains Syllabus
        </button>
        <button 
          className={`tab-btn ${activeTab === "anecdote" ? "active" : ""}`}
          onClick={() => setActiveTab("anecdote")}
        >
          Anecdote & Quotes
        </button>
        <button 
          className={`tab-btn ${activeTab === "explainers" ? "active" : ""}`}
          onClick={() => setActiveTab("explainers")}
        >
          Recent Explainers
        </button>
      </div>

      <div className="content-section">
        {activeTab === "prelims" && <PrelimsSyllabus />}
        {activeTab === "mains" && <MainsSyllabus />}
        {activeTab === "anecdote" && (
          <AnecdoteQuotes explainers={explainers} />
        )}
        {activeTab === "explainers" && (
          <RecentExplainers explainers={explainers} />
        )}
      </div>
    </div>
  );
};

export default AnecdotePage;