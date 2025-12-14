// This component displays a dropdown list of categories.
// When the user picks one, it filters the posts.

import React from "react";

const CategoryFilter = ({ categories, onSelectCategory }) => {
  return (
    <div className="category-filter">
      <h4>Filter by Category</h4>
      <select onChange={(e) => onSelectCategory(e.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
