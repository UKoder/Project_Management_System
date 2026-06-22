const SearchFilterBar = ({ searchValue, onSearchChange, filters = [], children }) => {
  return (
    <div className="search-filter-bar" id="search-filter-bar">
      <div className="search-input-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.name}
          className="form-select"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          id={`filter-${filter.name}`}
          style={{ minWidth: '10rem' }}
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {children}
    </div>
  );
};

export default SearchFilterBar;
