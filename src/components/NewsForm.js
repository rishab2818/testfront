import React, { useState, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import { Form, Button, InputGroup } from "react-bootstrap";
import { createPostWithAnswer } from "../utils/api";
import { Toast, ToastContainer } from "react-bootstrap";
const newsCategories = [
  "World",
  "Politics",
  "Economy",
  "Technology",
  "Sports",
  "Health",
  "Entertainment",
];

const NewsForm = ({ userId, name, handleClose }) => {
  const [title, setTitle] = useState(""); // ✅ User must enter a title
  const [categories, setCategories] = useState([]); // ✅ Multi-select categories
  const [answer, setAnswer] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const quillRef = useRef(null);
  // ✅ Handle category selection (multi-select)
  const toggleCategory = (category) => {
    setCategories(
      (prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((c) => c !== category) // Remove if already selected
          : [...prevCategories, category] // Add if not selected
    );
  };

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      setToastMessage("Title cannot be empty!");
      setShowToast(true);
      return;
    }

    if (!answer.trim()) {
      setToastMessage("Answer cannot be empty!");
      setShowToast(true);
      return;
    }

    if (categories.length === 0) {
      setToastMessage("Please select at least one category.");
      setShowToast(true);
      return;
    }

    const payload = {
      _id: userId,
      title,
      categories, // ✅ Multi-selected categories
      type: "news",
      content: answer, // ✅ Answer content
      isPrivate: !isPublic, // ✅ Reverse mapping: public → false, private → true
      author: name, // ✅ Author name
    };

    try {
      const response = await createPostWithAnswer(payload); // ✅ Call API function
      setToastMessage("Submitted Successfully!");
      setShowToast(true);

      setTitle("");
      setAnswer("");
      setCategories([]);
      setIsPublic(true);

      // ✅ Close modal after submission
      handleClose();
    } catch (error) {
      console.error("Submission Error:", error);
      setToastMessage("Failed to submit. Please try again.");
      setShowToast(true);
    }
  };
  const imageHandler = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      const quill = quillRef.current.getEditor(); // Get Quill instance
      const range = quill.getSelection(); // Get cursor position
      if (range) {
        quill.insertEmbed(range.index, "image", imageUrl);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"], // ✅ Enables Image Button
        ],
        handlers: { image: imageHandler }, // ✅ Custom URL Upload
      },
    }),
    []
  );
  return (
    <Form>
      {/* Title Input */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter the news title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      {/* Multi-Select Categories */}
      <Form.Group className="mb-3">
        <Form.Label>Select Categories</Form.Label>
        <div>
          {newsCategories.map((category) => (
            <Button
              key={category}
              variant={
                categories.includes(category) ? "primary" : "outline-primary"
              }
              className="m-1"
              onClick={() => toggleCategory(category)}
            >
              {category} {categories.includes(category) ? "✅" : ""}
            </Button>
          ))}
        </div>
      </Form.Group>

      {/* Answer Editor */}
      <Form.Group className="mb-3">
        <Form.Label>Answer</Form.Label>
        <ReactQuill
          ref={quillRef}
          modules={modules}
          value={answer}
          onChange={setAnswer}
          style={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        />
      </Form.Group>

      {/* Privacy Toggle */}
      <Form.Group className="mb-3">
        <InputGroup>
          <InputGroup.Text>Privacy:</InputGroup.Text>
          <Button
            variant={isPublic ? "success" : "primary"}
            onClick={() => setIsPublic(!isPublic)}
          >
            <Button
              variant={isPublic ? "success" : "primary"} // Changed "danger" to "warning" for a softer look
              onClick={() => setIsPublic(!isPublic)}
            >
              {isPublic ? "Public 👁️‍🗨️" : "Private 🔐"}
            </Button>
          </Button>
        </InputGroup>
      </Form.Group>

      {/* Submit Button */}
      <Button variant="outline-primary" onClick={handleSubmit}>
        Submit
      </Button>
      <ToastContainer position="bottom center" className="p-3">
        <Toast
          bg="info"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Form>
  );
};

export default NewsForm;
