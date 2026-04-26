const NoticeFilters = ({ filters, categories, onChange, onSubmit, onReset }) => {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="card-body">
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                name="search"
                value={filters.search}
                onChange={onChange}
                placeholder="Search notices..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={filters.category} onChange={onChange}>
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sort">Sort</label>
              <select id="sort" name="sort" value={filters.sort} onChange={onChange}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="limit">Items per page</label>
              <select id="limit" name="limit" value={filters.limit} onChange={onChange}>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>

          <label className="inline-row" style={{ fontWeight: 600 }}>
            <input type="checkbox" name="pinnedOnly" checked={filters.pinnedOnly} onChange={onChange} />
            Show pinned notices only
          </label>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
            <button type="button" className="btn btn-outline" onClick={onReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeFilters;
