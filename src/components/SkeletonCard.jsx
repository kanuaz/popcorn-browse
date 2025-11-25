function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card">
      <div className="poster-wrapper skeleton-box" />
      <div className="movie-info">
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-line skeleton-line-sm" />
      </div>
    </div>
  );
}

export default SkeletonCard;
