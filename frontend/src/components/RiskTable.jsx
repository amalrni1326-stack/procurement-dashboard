import React, { useState, useMemo } from 'react';

const RiskTable = ({ suppliers }) => {
  const [sortField, setSortField] = useState('risk_score');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // default to desc for new field
    }
  };

  const sortedData = useMemo(() => {
    return [...suppliers].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [suppliers, sortField, sortDirection]);

  return (
    <div className="card">
      <h3 className="card-title">Supplier Risk Overview</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('supplier_name')}>
                Supplier {sortField === 'supplier_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('category')}>
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('annual_spend_usd')}>
                Annual Spend {sortField === 'annual_spend_usd' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('risk_score')}>
                Risk Score {sortField === 'risk_score' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('risk_level')}>
                Risk Level {sortField === 'risk_level' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((supplier) => (
              <tr key={supplier.supplier_name}>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.category}</td>
                <td>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(supplier.annual_spend_usd)}
                </td>
                <td>{supplier.risk_score.toFixed(2)}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`risk-badge risk-${supplier.risk_level}`}>
                    {supplier.risk_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
