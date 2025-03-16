import React, { useEffect, useState } from "react";
import { fetchGroupPosts } from "../utils/groupApi";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
const GroupPosts = ({ selectedGroup, addedquestion }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchGroupPosts(selectedGroup);
        setPosts(data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]); // Set empty array on error
      }
      setLoading(false);
    };
    if (selectedGroup) {
      loadPosts();
    }
  }, [selectedGroup, addedquestion]);

  return (
    <Row className="mt-4">
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) =>
          post?.title ? (
            <Col key={post._id} md={4} sm={12} className="mb-3">
              <Link
                to="/groupqna"
                state={{ post }}
                style={{ textDecoration: "none" }}
              >
                <Card className="cursor-pointer">
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>

                    <Card.Text>Category: {post.category.join(", ")}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ) : null
        )
      )}
    </Row>
  );
};

export default GroupPosts;
