import React from 'react';

const RecommendationsPanel = ({ opportunities }) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <h3 className="card-title">Savings Opportunities</h3>
      <div className="recommendations-container">
        {opportunities.length === 0 ? (
          <div className="empty-state">
            All supplier prices are within acceptable range.
          </div>
        ) : (
          opportunities.map((opp, idx) => (
            <div key={idx} className="recommendation-item">
              <span className="recommendation-text">
                Review pricing with <strong>{opp.supplier_name}</strong>. Price is {Math.round(opp.pct_above_median)}% above median in {opp.category}.
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationsPanel;
