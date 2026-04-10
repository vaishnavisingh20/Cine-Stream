import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('cine-stream-favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('cine-stream-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = (movie) => {
    const isFavorited = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorited) {
      const updated = favorites.filter(fav => fav.id !== movie.id);
      saveFavorites(updated);
    } else {
      saveFavorites([movie, ...favorites]);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};