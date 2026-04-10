import React, { forwardRef, useState, useCallback } from 'react';

const MovieCard = forwardRef(({ movie, onToggleFavorite, isFavorited }, ref) => {
  const [imgError, setImgError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 🛡️ ULTIMATE IMAGE ERROR HANDLER
  const handleImageError = useCallback((e) => {
    console.log('🛡️ Fixing poster for:', movie.title);
    setImgError(true);
    setImageLoaded(true);
    
    // Set ultimate fallback
    e.target.src = getFallbackPoster(movie.title);
    e.target.onerror = null; // Prevent loop
  }, [movie.title]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImgError(false);
  }, []);

  // 🛡️ FALLBACK POSTER GENERATOR
  const getFallbackPoster = (title) => {
    return `https://via.placeholder.com/300x450/1e293b/94a3b8/ffffff?text=${encodeURIComponent(title.substring(0, 12) + '...')}&font=roboto`;
  };

  return (
    <div className="movie-card" ref={ref}>
      {/* 🖼️ POSTER CONTAINER */}
      <div className="poster-container">
        {/* Main Image */}
        <img 
          src={movie.poster}
          alt={`${movie.title} poster`}
          className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          draggable="false"
        />
        
        {/* 🔄 LOADING SHIMMER */}
        {!imageLoaded && (
          <div className="poster-shimmer" />
        )}
        
        {/* ❌ ERROR FALLBACK */}
        {imgError && (
          <div className="poster-fallback">
            <span>🎬</span>
            <small>{movie.title}</small>
          </div>
        )}
      </div>

      {/* 📝 MOVIE INFO */}
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title.length > 25 
            ? movie.title.substring(0, 25) + '...' 
            : movie.title
          }
        </h3>
        
        <div className="movie-meta">
  <div className="meta-left">
    <span className="rating">{movie.year}</span>
    <span className="imdb-rating">⭐ {movie.imdbRating}</span>
    <span className="type">{movie.type?.charAt(0).toUpperCase() || 'Movie'}</span>
  </div>
          
          <button
            className={`favorite-btn ${isFavorited ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '💖' : '🤍'}
          </button>
        </div>
      </div>

      {/* 💅 INLINE STYLES */}
      <style jsx>{`
        .poster-container {
          position: relative;
          height: 350px;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }
        
        .movie-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
          opacity: 0;
        }
        
        .movie-poster.loaded {
          opacity: 1;
          animation: fadeInUp 0.6s ease-out;
        }
        
        .poster-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            #0f0f23 0%,
            #16213e 25%, 
            #0f0f23 50%,
            #16213e 75%,
            #0f0f23 100%
          );
          background-size: 300% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 20px 20px 0 0;
        }
        
        .poster-fallback {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          text-align: center;
          border-radius: 20px 20px 0 0;
        }
        
        .poster-fallback small {
          font-size: 0.8rem;
          margin-top: 0.5rem;
          opacity: 0.9;
          max-width: 80%;
        }
        
        @keyframes shimmer {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export { MovieCard };
