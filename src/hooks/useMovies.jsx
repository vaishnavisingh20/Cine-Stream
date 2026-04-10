import { useState, useEffect, useCallback, useRef } from 'react';

export const useMovies = (apiKey, query = '') => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // 🛡️ PERFECT POSTER
  const getPerfectPoster = (omdbPoster, movieTitle) => {
    if (omdbPoster && omdbPoster !== 'N/A' && omdbPoster.includes('._V1_')) {
      return omdbPoster;
    }

    const popularPosters = {
      batman: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQywj.jpg',
      matrix: 'https://image.tmdb.org/t/p/w500/kPj9E2H8NTrSHP5Iwv43K4wWb7s.jpg',
      avengers: 'https://image.tmdb.org/t/p/w500/agsAzy9QbPKWqMAuZ4Oenc61O2M.jpg',
      inception: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    };

    const titleLower = movieTitle.toLowerCase();
    for (const [key, url] of Object.entries(popularPosters)) {
      if (titleLower.includes(key)) return url;
    }

    return `https://via.placeholder.com/300x450/0f172a/64748b/ffffff?text=${encodeURIComponent(
      movieTitle.substring(0, 15)
    )}`;
  };

  // 🎯 Fetch Movies
  const fetchMovies = useCallback(
    async (searchQuery, pageNum = 1, append = false) => {
      if (!searchQuery || !apiKey) {
        setError('Search query or API key missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
            searchQuery
          )}&page=${pageNum}`
        );

        const data = await response.json();

        if (data.Response === 'True') {
          const newMovies = data.Search.map((movie) => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: getPerfectPoster(movie.Poster, movie.Title),
            type: movie.Type
          }));

          setMovies((prevMovies) => {
            if (append) {
              const filteredNew = newMovies.filter(
                (nm) => !prevMovies.some((pm) => pm.id === nm.id)
              );
              return [...prevMovies, ...filteredNew];
            }
            return newMovies;
          });

          setHasMore(newMovies.length === 10);
          setPage(pageNum);
        } else {
          setMovies([]);
          setHasMore(false);
          setError(data.Error || 'No movies found');
        }
      } catch (err) {
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  // 🔄 Handle Query Change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);

    if (query && query.trim()) {
      fetchMovies(query.trim(), 1, false);
    }
  }, [query, fetchMovies]);

  // ♾️ Infinite Scroll
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading || !hasMore || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMovies(query, page + 1, true);
        }
      });

      observer.current.observe(node);
    },
    [loading, hasMore, fetchMovies, query, page]
  );

  // 🔄 Manual Refresh
  const refreshMovies = useCallback(
    (newQuery) => {
      fetchMovies(newQuery || 'Batman', 1, false);
    },
    [fetchMovies]
  );

  // 📊 Debug Logger (FIXED ✅)
  useEffect(() => {
    if (movies.length > 0) {
      const uniqueIds = new Set(movies.map((m) => m.id));
      console.log(
        `📊 ${movies.length} movies | ${uniqueIds.size} unique`,
        uniqueIds.size === movies.length ? '✅' : '⚠️'
      );
    }
  }, [movies]); // ✅ ESLint fixed

  return {
    movies,
    loading,
    error,
    hasMore,
    lastMovieElementRef,
    refreshMovies
  };
};