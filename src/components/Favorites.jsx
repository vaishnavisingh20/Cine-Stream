import React from 'react';
import { MovieCard } from './MovieCard';
import { useFavorites } from '../hooks/useFavorites';

export const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
        My Favorites ❤️ ({favorites.length})
      </h2>
      
      {favorites.length === 0 ? (
        <div className="favorites-empty">
          No favorites yet. Start discovering movies and add some to your list!
        </div>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleFavorite={toggleFavorite}
              isFavorited={isFavorite(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};