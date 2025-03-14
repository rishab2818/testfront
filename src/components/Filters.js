import React from "react";
import CategoryFilter from "./CategoryFilter";
import { Dropdown } from "react-bootstrap";
const Filters = ({
  filterType,
  setFilterType,
  selectedCategory,
  setSelectedCategory,
  toggle,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3 pt-md-0 flex-row-reverse flex-md-row sticky-top">
      <Dropdown onSelect={(eventKey) => setFilterType(eventKey)}>
        <Dropdown.Toggle variant="outline-primary" className="w-auto">
          {filterType === "followers" ? "Follower's" : "All"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="followers">Follower's</Dropdown.Item>
          <Dropdown.Item eventKey="all">All</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <CategoryFilter
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        ctype={toggle} // Dynamic type (news/upsc)
      />
    </div>
  );
};

export default Filters;
