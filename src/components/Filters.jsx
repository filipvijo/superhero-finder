const Filters = ({ publisherFilter, setPublisherFilter, alignmentFilter, setAlignmentFilter }) => (
  <div className="filters-container mb-6 flex flex-wrap gap-4 justify-center">
    <select
      value={publisherFilter}
      onChange={(e) => setPublisherFilter(e.target.value)}
      className="filter-select"
    >
      <option value="all">All Publishers</option>
      <option value="Marvel Comics">Marvel</option>
      <option value="DC Comics">DC</option>
    </select>
    <select
      value={alignmentFilter}
      onChange={(e) => setAlignmentFilter(e.target.value)}
      className="filter-select"
    >
      <option value="all">All Alignments</option>
      <option value="good">Good</option>
      <option value="bad">Bad</option>
      <option value="neutral">Neutral</option>
    </select>
  </div>
);

export default Filters;
