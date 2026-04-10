import React, { useState, useCallback } from 'react'; 
import { MovieCard } from './MovieCard';
import { SearchBar } from './SearchBar';
import { useMovies } from '../hooks/useMovies';
import { useFavorites } from '../hooks/useFavorites';

export const MovieGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;
  
  const { 
    movies, 
    loading, 
    error, 
    hasMore, 
    lastMovieElementRef, 
    refreshMovies 
  } = useMovies(apiKey, searchQuery);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = useCallback((query) => {
    console.log('🎯 Search changed:', query || '[Popular]');
    setSearchQuery(query);
  }, []);

  // API Key Check
  if (!apiKey) {
    return (
      <div style={{textAlign: 'center', padding: '4rem', color: '#ff6b6b'}}>
        <h2>🚫 Missing API Key</h2>
        <p>Create <code>.env</code> → <code>REACT_APP_OMDB_API_KEY=yourkey</code></p>
        <button 
          onClick={() => window.location.reload()} 
          style={{padding: '1rem 2rem', background: '#4ecdc4', border: 'none', borderRadius: '25px'}}
        >
          🔄 Restart
        </button>
      </div>
    );
  }

  return (
    <div style={{minHeight: '80vh'}}>
      <SearchBar onSearch={handleSearch} />
      
      {/* Error */}
      {error && (
        <div className="error" style={{textAlign: 'center', padding: '2rem'}}>
          <strong>❌ {error}</strong>
          <br/>
          <button 
            onClick={() => refreshMovies(searchQuery || 'Batman')}
            style={{
              marginTop: '1rem', padding: '0.7rem 1.5rem', 
              background: '#4ecdc4', border: 'none', 
              borderRadius: '25px', cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Movie Grid */}
      <div className="movie-grid">
        {/* Initial Empty State */}
        {movies.length === 0 && !loading && !error && !searchQuery && (
          <div className="empty-state" style={{gridColumn: '1/-1'}}>
            <h2>🎉 Welcome!</h2>
            <p>Search any movie name or scroll for more</p>
          </div>
        )}

        {/* Search No Results */}
        {movies.length === 0 && !loading && !error && searchQuery && (
          <div className="empty-state" style={{gridColumn: '1/-1'}}>
            <h3>🔍 No results for "{searchQuery}"</h3>
            <p>Try "Avengers", "Batman", "Matrix"</p>
          </div>
        )}
        
        {/* Movies */}
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}  // 🎯 UNIQUE KEY = No React warnings
            movie={movie}
            ref={movies.length === index + 1 && hasMore ? lastMovieElementRef : null}
            onToggleFavorite={toggleFavorite}
            isFavorited={isFavorite(movie.id)}
          />
        ))}
        
        {/* Loading States */}
        {loading && movies.length === 0 && (
          <div className="loading" style={{gridColumn: '1/-1'}}>
            🎬 Loading {searchQuery || 'popular'} movies...
          </div>
        )}
        {loading && movies.length > 0 && (
          <div className="loading" style={{gridColumn: '1/-1'}}>
            📥 Loading more...
          </div>
        )}
        
        {!hasMore && movies.length > 0 && (
          <div className="empty-state" style={{gridColumn: '1/-1'}}>
            🎉 {movies.length} movies loaded!
          </div>
        )}
      </div>

      {/* 📊 Status Bar */}
      {movies.length > 0 && (
        <div style={{
          textAlign: 'center', margin: '2rem 0', 
          padding: '1rem', background: 'rgba(255,255,255,0.1)',
          borderRadius: '25px', backdropFilter: 'blur(10px)'
        }}>
          <strong>{movies.length} movies</strong> | 
          {hasMore && ' Scroll for more...'} | 
          <em> "{searchQuery || 'Popular'}"</em>
        </div>
      )}
    </div>
  );
};