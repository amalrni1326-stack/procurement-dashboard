import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import KPICard from './components/KPICard';
import SpendChart from './components/SpendChart';
import RiskDistributionChart from './components/RiskDistributionChart';
import RiskTable from './components/RiskTable';
import RecommendationsPanel from './components/RecommendationsPanel';
import UploadCSV from './components/UploadCSV';

import './index.css';

const API_BASE = 'http://localhost:8000/api';

const App = () => {
  const [data, setData] = useState({
    spendSummary: null,
    suppliers: null,
    opportunities: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [polling, setPolling] = useState(false);

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setPolling(true);
    setError(null);

    try {
      const [spendRes, suppliersRes, oppsRes] = await Promise.all([
        axios.get(`${API_BASE}/spend-summary`),
        axios.get(`${API_BASE}/suppliers`),
        axios.get(`${API_BASE}/savings-opportunities`)
      ]);

      setData({
        spendSummary: spendRes.data,
        suppliers: suppliersRes.data.Data || suppliersRes.data.Items || suppliersRes.data,
        opportunities: oppsRes.data.Data || oppsRes.data.Items || oppsRes.data,
      });
      setLastFetch(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to fetch data. The API is unreachable.');
    } finally {
      if (isInitial) setLoading(false);
      else setPolling(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => {
      fetchData(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot loading" style={{ transform: 'scale(3)', margin: '0 auto 1rem' }}></div>
          <p>Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="card" style={{ borderColor: 'var(--color-high)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-high)', marginBottom: '1rem' }}>Connection Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => fetchData(true)} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Extract count data for suppliers and opportunities based on actual API payload shapes
  let suppliersList = Array.isArray(data.suppliers) ? data.suppliers : (data.suppliers?.Data || []);
  // The backend was observed to return { Data: [...], Count: X }
  let suppliersCount = data.suppliers.Count ?? suppliersList.length;

  let oppsList = Array.isArray(data.opportunities) ? data.opportunities : (data.opportunities?.Data || []);
  let oppsCount = data.opportunities.Count ?? oppsList.length;

  // Calculate KPIs
  const totalSuppliers = suppliersCount;
  
  // Total Spend
  const totalSpend = data.spendSummary 
    ? (Array.isArray(data.spendSummary) 
        ? data.spendSummary.reduce((sum, item) => sum + (item.amount || 0), 0)
        : Object.values(data.spendSummary).reduce((sum, val) => sum + val, 0))
    : 0;

  // Risk Flags
  const riskFlags = suppliersList.filter(s => s.risk_level === 'HIGH').length;

  // Savings %
  const savingsPct = totalSuppliers > 0 
    ? ((oppsCount / totalSuppliers) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="app-container">
      <header className="header" style={{ marginBottom: '1rem' }}>
        <h1>Procurement Intelligence Dashboard</h1>
        <div className="status-indicator">
          {polling ? (
            <><div className="status-dot loading"></div> Syncing...</>
          ) : (
             <><div className="status-dot"></div> Live Update: {lastFetch ? lastFetch.toLocaleTimeString() : ''}</>
          )}
        </div>
      </header>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <UploadCSV onUploadSuccess={() => fetchData(true)} />
      </div>

      <section className="kpi-row">
        <KPICard 
          title="Total Suppliers" 
          value={totalSuppliers} 
          color="var(--accent-color)" // blue
        />
        <KPICard 
          title="Total Spend" 
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 4, notation: "compact" }).format(totalSpend)} 
          color="var(--color-low)" // green
        />
        <KPICard 
          title="Risk Flags" 
          value={riskFlags} 
          color="var(--color-high)" // red
        />
        <KPICard 
          title="Savings %" 
          value={`${savingsPct}%`} 
          color="var(--color-medium)" // amber
        />
      </section>

      <section className="dashboard-grid">
        <SpendChart data={data.spendSummary} />
        <RiskDistributionChart suppliers={suppliersList} />
      </section>

      <section className="dashboard-grid">
        <RiskTable suppliers={suppliersList} />
        <RecommendationsPanel opportunities={oppsList} />
      </section>
    </div>
  );
};

export default App;
