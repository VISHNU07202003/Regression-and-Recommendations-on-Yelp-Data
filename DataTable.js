import React, { useState, useEffect } from 'react';
import './DataTable.css';

function DataTable({ businesses }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rating', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (!businesses) return;
    
    let filtered = [...businesses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [businesses, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadCSV = () => {
    const headers = ['Business Name', 'Category', 'City', 'State', 'Rating', 'Reviews', 'Price', 'Status'];
    const rows = filteredData.map(b => [
      b.name,
      b.category,
      b.city,
      b.state,
      b.rating,
      b.reviewCount,
      b.priceRange || 'N/A',
      b.isOpen ? 'Open' : 'Closed'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yelp_businesses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="stars">
        {'⭐'.repeat(fullStars)}
        {hasHalfStar && '✨'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <section className="data-table-section">
      <div className="table-header">
        <div className="header-left">
          <h2>📋 Detailed Business Data</h2>
          <p>Sortable and filterable business insights</p>
        </div>
      </div>

      <div className="table-controls">
        <input
          type="text"
          className="table-search"
          placeholder="Search businesses, categories, or cities..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn-download" onClick={handleDownloadCSV}>
          📥 Download CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="business-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Business Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('city')} className="sortable">
                City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('rating')} className="sortable">
                Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('reviewCount')} className="sortable">
                Reviews {sortConfig.key === 'reviewCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((business, index) => (
              <tr key={business.id || index}>
                <td className="business-name">
                  <strong>{business.name}</strong>
                </td>
                <td>
                  <span className="category-badge">{business.category}</span>
                </td>
                <td>{business.city}, {business.state}</td>
                <td className="rating-cell">
                  <span className="rating-value">{business.rating.toFixed(1)}</span>
                  {renderStars(business.rating)}
                </td>
                <td className="reviews-cell">{business.reviewCount.toLocaleString()}</td>
                <td className="price-cell">{business.priceRange || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${business.isOpen ? 'open' : 'closed'}`}>
                    {business.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="btn-page" 
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        
        <span className="page-info">
          Page {currentPage} of {totalPages} ({filteredData.length} businesses)
        </span>
        
        <button 
          className="btn-page" 
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

export default DataTable;