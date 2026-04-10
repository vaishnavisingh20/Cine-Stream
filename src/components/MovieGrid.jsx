import React, { useState, useCallback } from 'react';
import { MovieCard } from './MovieCard';
import { SearchBar } from './SearchBar';
import { useMovies } from '../hooks/useMovies';
import { usePopularMovies } from '../hooks/usePopularMovies';  // ← NEW
import { useFavorites } from '../hooks/useFavorites';

export const MovieGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;
  
  // Search results
  const { movies, loading, error, hasMore, lastMovieElementRef, refreshMovies } = useMovies(apiKey, searchQuery);
  
  // Popular movies (empty search)
  const { popularMovies, loading: popularLoading } = usePopularMovies(apiKey);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query || '');
  }, []);

  if (!apiKey) {
    return (
      <div style={{textAlign: 'center', padding: '4rem', color: '#ff6b6b'}}>
        <h2>🚫 Missing API Key</h2>
        <p>Create <code>.env</code> → <code>REACT_APP_OMDB_API_KEY=yourkey</code></p>
      </div>
    );
  }

  // Show popular movies when no search
  const displayMovies = searchQuery ? movies : popularMovies;
  const isLoading = searchQuery ? loading : popularLoading;

  return (
    <div style={{minHeight: '80vh'}}>
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="error">
          ❌ {error}
          <button onClick={() => refreshMovies(searchQuery || '')}>🔄 Retry</button>
        </div>
      )}

      <div className="movie-grid">
        {displayMovies.length === 0 && !isLoading && !error && (
          <div className="empty-state" style={{gridColumn: '1/-1'}}>
            {searchQuery 
              ? <h3>🔍 No results for "{searchQuery}"</h3>
              : <h2>🎉 Loading popular movies...</h2>
            }
          </div>
        )}
        
        {displayMovies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            ref={
              !searchQuery && 
              popularMovies.length === index + 1 && 
              hasMore 
                ? lastMovieElementRef 
                : null
            }
            onToggleFavorite={toggleFavorite}
            isFavorited={isFavorite(movie.id)}
          />
        ))}
        
        {isLoading && (
          <div className="loading" style={{gridColumn: '1/-1'}}>
            {searchQuery ? '📥 Loading more...' : '🎬 Loading popular movies...'}
          </div>
        )}
      </div>

      {displayMovies.length > 0 && (
        <div style={{
          textAlign: 'center', margin: '2rem 0', 
          padding: '1rem', background: 'rgba(255,255,255,0.1)',
          borderRadius: '25px'
        }}>
          <strong>{displayMovies.length} movies</strong> | 
          {!searchQuery && 'Popular Picks'} | 
          {searchQuery && `"${searchQuery}" results`}
        </div>
      )}
    </div>
  );
};
