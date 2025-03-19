import { useState } from "react";
import { Dropdown } from "react-bootstrap";

const UPSC_CATEGORIES = [
  "All",
  "Ancient History",
  "Medieval History",
  "Modern History",
  "Post-Independence History",
  "World History",
  "Physical Geography",
  "Indian Geography",
  "World Geography",
  "Economic Geography",
  "Indian Polity",
  "Governance & Public Policy",
  "Political Theories",
  "International Law & Organizations",
  "Indian Economy",
  "Macroeconomics & Microeconomics",
  "Banking & Finance",
  "International Economy",
  "Space & Defense Technology",
  "Biotechnology & Health",
  "Artificial Intelligence & IT",
  "Basic & Applied Science",
  "Climate Change",
  "Biodiversity & Conservation",
  "Environmental Laws & Treaties",
  "Disaster Management",
  "India’s Bilateral Relations",
  "Global Institutions",
  "Geopolitical Issues",
  "Foreign Policies & Agreements",
  "Ethical Theories",
  "Public Administration Ethics",
  "Philosophy & Thinkers",
  "Case Studies & Real-Life Applications",
  "Current Affairs",
  "Government Schemes & Policies",
  "Social Issues",
  "Indian Society & Culture",
  "Internal Security",
  "Science & Disaster Management",
  "Indian Art & Culture",
  "Agriculture & Food Security",
  "Social Justice & Welfare",
  "General Life Question",
];

const NEWS_CATEGORIES = [
  "All",
  "World",
  "Politics",
  "Economy",
  "Technology",
  "Sports",
  "Health",
  "Entertainment",
];

const CategoryFilter = ({ setSelectedCategory, ctype }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategory, setShowCategory] = useState("All");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategory(category); // Update category display
    setShowDropdown(false); // Close dropdown after selection
  };

  const categories = ctype === "question" ? UPSC_CATEGORIES : NEWS_CATEGORIES;

  return (
    <div className="my-4 text-center">
      {/* Dropdown for All Screens */}
      <Dropdown
        show={showDropdown}
        onToggle={() => setShowDropdown(!showDropdown)}
      >
        <Dropdown.Toggle variant="primary" className="w-100">
          {showCategory}
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="w-100"
          style={{ maxHeight: "300px", overflowY: "auto" }} // Add scrollable menu
        >
          {categories.map((category) => (
            <Dropdown.Item
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CategoryFilter;
