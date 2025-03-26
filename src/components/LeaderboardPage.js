import React, { useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchTopUsersOfMonth } from "../utils/api"; // Import API call function
import { Link } from "react-router-dom";
const medals = ["🥇", "🥈", "🥉"];

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const getLeaderboardData = async () => {
      setLoading(true);
      const data = await fetchTopUsersOfMonth();
      setUsers(data);
      setLoading(false);
    };
    getLeaderboardData();
  }, []);


  const displayedUsers = showAll ? users.slice(0, 100) : users.slice(0, 10);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-lg w-100" style={{ maxWidth: "600px" }}>
        <div className="card-body text-center">
          <h2 className="card-title fw-bold mb-4">
            <i className="bi bi-trophy text-warning"></i> Leaderboard
          </h2>

          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <Table striped bordered hover responsive className="text-center">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user, index) => (
                    <tr key={user._id} className={index < 3 ? "table-warning" : ""}>
                      <td className="fw-bold">{index < 3 ? medals[index] : index + 1}</td>
                      <td>
                      <Link 
    to={`/author/${user._id}/true`} 
    state={{ author: { userId: user._id, includePrivate: true } }}
  >
    {user.name}
  </Link>
                      </td>
                      <td>{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <p className="text-muted mt-3">
                🎉 This month’s top 3 users will receive ₹1200, ₹1000, and ₹800 respectively at the end of the month!
              </p>

              {users.length > 10 && (
                <Button variant="primary" className="mt-3" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show Top 10" : "View Full Rankings"}
                </Button>
              )}


              


            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

/*
=============================================
### Professional Mathematical Model for Points System ###
=============================================

Let \( P \) represent the total points of a user. The points change based on the following actions:

#### **1. Adding an Answer**
   - \( P_{user} = P_{user} + 5 \)

#### **2. Adding a Question**
   - \( P_{user} = P_{user} + 5 \)

#### **3. Liking an Answer**
   - \( P_{liker} = P_{liker} + 2 \)
   - \( P_{liked} = P_{liked} + 6 \)

#### **4. Creating a Prelims Question**
   - \( P_{user} = P_{user} + 5 \)

#### **5. Voting on a Prelims Question**
   - \( P_{voter} = P_{voter} + 2 \)
   - Changing vote on the same question: \( \Delta P = 0 \)

#### **6. Following a User**
   - \( P_{follower} = P_{follower} + 2 \)
   - \( P_{followed} = P_{followed} + 4 \)

#### **7. Unfollowing a User**
   - \( P_{follower} = P_{follower} - 2 \)
   - \( P_{followed} = P_{followed} - 4 \)

#### **8. Deleting an Answer**
   - \( P_{user} = P_{user} - 5 \)

#### **9. Adding an Answer within 24 Hours**
   - Additional bonus: \( P_{user} = P_{user} + 4 \)

#### **10. Rating an Answer**
   - \( P_{rater} = P_{rater} + 5 \)

   - **Answer Author's Points from Rating:**
     Let \( S \) be the sum of ratings given by the user on different aspects:
     \[
     S = (SC + FA + P + DA + RQ + OR)
     \]
     where:
     - \( SC \) = Structure & Clarity
     - \( FA \) = Factual Accuracy
     - \( P \) = Presentation
     - \( DA \) = Depth of Analysis
     - \( RQ \) = Relevance to Question
     - \( OR \) = Overall Rating

     The **points gained by the answer author** from rating are:
     \[
     P_{author} = 6 + \left( \frac{S}{6} \right) \times 3
     \]
     The maximum points an author can gain from one rating is:
     \[
     P_{author} \leq 24
     \]
*/
