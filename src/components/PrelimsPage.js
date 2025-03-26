import React, { useState, useEffect,useContext } from "react";
import { Button, Container, Row, Col, Pagination,Toast } from "react-bootstrap";
import AddPrelimsQuestion from "./AddPrelimsQuestion";
import QuestionCard from "./QuestionCard";
import { fetchPrelimsQuestions } from "../utils/api.js"; // Import the utility function
import AuthContext from "../context/AuthContext";
const PrelimsPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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

    // Handle Add Question button click
    const handleAddQuestion = () => {
      if (!user || !user._id) {
        setToastMessage("Sign in to add a question");
        setShowToast(true);
      } else {
        setShowModal(true);
      }
    };
  

  return (
    <Container fluid className="mt-1">
 
      {/* Floating Button */}
      <Button variant="primary mt-0" onClick={handleAddQuestion}>
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
            {/* Toast Notification */}
            <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#17a2b8",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default PrelimsPage;
