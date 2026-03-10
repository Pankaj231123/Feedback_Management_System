import React from 'react';
import './FeedbackModal.css';

interface SearchFiltersProps {
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  nameValue: string;
  categoryValue: string;
  priorityValue: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onNameChange,
  onCategoryChange,
  onPriorityChange,
  nameValue,
  categoryValue,
  priorityValue,
}) => {
  return (
    <div className="search-filters">
      <div className="filter-group">
        <label htmlFor="name-filter">Search by Name</label>
        <input
          type="text"
          id="name-filter"
          placeholder="Enter name..."
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Bug">Bug</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Complaint">Complaint</option>
          <option value="Praise">Praise</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={priorityValue}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
};
