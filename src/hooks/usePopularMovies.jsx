import { useState, useEffect, useCallback } from 'react';

export const usePopularMovies = (apiKey) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopular = useCallback(async () => {
    if (!apiKey) {
      setError('API key missing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🎬 Fetch popular action/adventure movies
      const searchRes = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=action adventure drama comedy&page=1`
      );
      const searchData = await searchRes.json();

      if (searchData.Response === 'True') {
        // Get details + ratings for top 20
        const moviesWithRatings = await Promise.all(
          searchData.Search.slice(0, 20).map(async (movie) => {
            try {
              const detailRes = await fetch(
                `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`
              );
              const details = await detailRes.json();
              return {
                id: movie.imdbID,
                title: movie.Title,
                year: movie.Year,
                poster: details.Poster !== 'N/A' ? details.Poster : movie.Poster,
                type: movie.Type,
                imdbRating: details.imdbRating || 'N/A'
              };
            } catch {
              return {
                id: movie.imdbID,
                title: movie.Title,
                year: movie.Year,
                poster: movie.Poster,
                type: movie.Type,
                imdbRating: 'N/A'
              };
            }
          })
        );
        setPopularMovies(moviesWithRatings);
      }
    } catch (err) {
      setError('Failed to load popular movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return { popularMovies, loading, error };
};