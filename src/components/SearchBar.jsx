import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 500);

  // Only call onSearch if it exists and query changed
  React.useEffect(() => {
    if (onSearch && debouncedQuery && debouncedQuery.length > 0) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search for movies... (e.g., Batman, Matrix)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};