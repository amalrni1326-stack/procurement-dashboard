import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpreadChart = ({ data }) => {
  // data is expected to be an object: { "CategoryName": value, ... }
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Array of distinct colors
  const backgroundColors = [
    'rgba(26, 86, 219, 0.8)', // accent color
    'rgba(16, 185, 129, 0.8)', // low risk green
    'rgba(245, 158, 11, 0.8)', // medium risk amber
    'rgba(239, 68, 68, 0.8)', // high risk red
    'rgba(139, 92, 246, 0.8)', // purple
    'rgba(14, 165, 233, 0.8)' // light blue
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spend ($)',
        data: values,
        backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="card" style={{ height: '350px' }}>
      <h3 className="card-title">Spend by Category</h3>
      <div style={{ height: 'calc(100% - 30px)' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SpreadChart;
