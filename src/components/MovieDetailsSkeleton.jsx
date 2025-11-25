function MovieDetailsSkeleton() {
  return (
    <div className="movie-page">
      <div className="backdrop skeleton-box" />
      <section className="movie-hero">
        <div className="hero-poster">
          <div className="skeleton-box skeleton-poster" />
        </div>
        <div className="hero-info">
          <div className="skeleton-line skeleton-line-xl" />
          <div className="skeleton-line skeleton-line-md" />
          <div className="skeleton-line skeleton-line-md" />
          <div className="skeleton-pill-row">
            <div className="skeleton-pill" />
            <div className="skeleton-pill" />
            <div className="skeleton-pill" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieDetailsSkeleton;
