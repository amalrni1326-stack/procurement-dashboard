import React from 'react';

const KPICard = ({ title, value, color }) => {
  return (
    <div className="card kpi-card">
      <div className="kpi-border" style={{ backgroundColor: color }}></div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{title}</div>
    </div>
  );
};

export default KPICard;
