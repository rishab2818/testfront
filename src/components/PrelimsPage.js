import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Pagination } from "react-bootstrap";
import AddPrelimsQuestion from "./AddPrelimsQuestion";
import QuestionCard from "./QuestionCard";
import { fetchPrelimsQuestions } from "../utils/api.js"; // Import the utility function

const PrelimsPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const questionsPerPage = 6; // Adjust based on your needs
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = data.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Fetch questions using the utility function
  const getQuestions = async () => {
    const result = await fetchPrelimsQuestions();
    if (result.success) {
      setData(result.data); // Update state with fetched data
      console.log(result.data, "result");
    } else {
      console.error(result.message); // Handle error
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <Container fluid className="mt-1">
      {/* Floating Button */}
      <Button variant="primary mt-0" onClick={() => setShowModal(true)}>
        +
      </Button>

      {/* Questions List */}
      <Row>
        {currentQuestions.map((q) => (
          <Col key={q.id} xs={12} md={6} lg={4} className="mb-4">
            <QuestionCard
              question={q.question}
              author={q.author}
              category={q.category}
              options={{
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
              }}
              likes={q.likes}
              votes={q.votes}
              questionId={q._id} // Pass questionId
              fetchQuestions={getQuestions} // Pass fetchQuestions to refresh the list
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(Math.ceil(data.length / questionsPerPage))].map(
          (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      {/* Add New Question Modal */}
      <AddPrelimsQuestion
        showModal={showModal}
        setShowModal={setShowModal}
        fetchQuestions={getQuestions} // Pass the refetch function
      />
    </Container>
  );
};

export default PrelimsPage;
