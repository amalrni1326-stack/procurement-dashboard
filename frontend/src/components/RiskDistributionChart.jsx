import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskDistributionChart = ({ suppliers }) => {
  const counts = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    suppliers.forEach(supp => {
      if (counts[supp.risk_level] !== undefined) {
        counts[supp.risk_level]++;
      }
    });
    return counts;
  }, [suppliers]);

  const data = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [counts.HIGH, counts.MEDIUM, counts.LOW],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // HIGH - red
          'rgba(245, 158, 11, 0.8)', // MEDIUM - amber
          'rgba(16, 185, 129, 0.8)', // LOW - green
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="card" style={{ height: '350px' }}>
      <h3 className="card-title">Risk Distribution</h3>
      <div style={{ height: 'calc(100% - 30px)' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskDistributionChart;
