import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

const UPSC_CATEGORIES = [
  "All",
  "History",
  "Geography",
  "Polity",
  "Economics",
  "Science & Tech",
  "Environment",
  "International Relations",
  "Ethics",
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
  };

  const categories = ctype === "question" ? UPSC_CATEGORIES : NEWS_CATEGORIES;

  return (
    <div className="my-4 text-center">
      {/* Large Screens: Buttons */}
      <div className="d-none d-md-flex gap-2 flex-wrap justify-content-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={showCategory === category ? "primary" : "outline-primary"}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Small Screens: Dropdown */}
      <div className="d-md-none text-center">
        <Dropdown
          show={showDropdown}
          onToggle={() => setShowDropdown(!showDropdown)}
        >
          <Dropdown.Toggle variant="primary">{showCategory}</Dropdown.Toggle>
          <Dropdown.Menu>
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
    </div>
  );
};

export default CategoryFilter;
