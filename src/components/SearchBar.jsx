import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // 🛡️ DEBOUNCE 500ms
  const debouncedQuery = useDebounce(query, 500);

  // 🔥 CALLBACK - Safe for parent
  const handleSearch = useCallback((searchTerm) => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(searchTerm);
    }
  }, [onSearch]);

  // 🚀 Trigger search on debounced change
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search movies... (Avengers, Batman, Matrix)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* 🕐 Debounce indicator */}
        {query && (
          <span className={`debounce-indicator ${debouncedQuery === query ? 'ready' : 'waiting'}`}>
            {debouncedQuery === query ? '✅' : '⏳'}
          </span>
        )}
      </div>
      
      {/* 💡 Typing indicator */}
      {query && debouncedQuery !== query && (
        <small style={{opacity: 0.7, fontStyle: 'italic'}}>
          Waiting {Math.ceil((500 - (Date.now() % 500)) / 100)}s...
        </small>
      )}
    </div>
  );
};
