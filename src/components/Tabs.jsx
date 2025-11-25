const tabs = [
  { id: 'popular', label: 'Popular' },
  { id: 'now_playing', label: 'Now playing' },
  { id: 'top_rated', label: 'Top rated' },
  { id: 'upcoming', label: 'Upcoming' },
];

function Tabs({ active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? 'tab active' : 'tab'}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
