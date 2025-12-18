import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ControlPanel from './components/ControlPanel';
import KPICards from './components/KPICards';
import RatingHeatmap from './components/RatingHeatmap';
import TimelineChart from './components/TimelineChart';
import TopBusinesses from './components/TopBusinesses';
import ScatterPlot from './components/ScatterPlot';
import GeographicMap from './components/GeographicMap';
import CategoryChart from './components/CategoryChart';
import SentimentAnalysis from './components/SentimentAnalysis';
import UserEngagement from './components/UserEngagement';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  // State management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [geographic, setGeographic] = useState([]);
  const [categories, setCategories] = useState([]);
  const [engagement, setEngagement] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    city: 'all',
    category: 'all',
    minRating: '0',
    timeRange: 'all',
    search: ''
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (!loading) {
      fetchFilteredData();
    }
  }, [filters]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        businessesRes,
        timelineRes,
        heatmapRes,
        sentimentRes,
        geoRes,
        categoriesRes,
        engagementRes
      ] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/businesses?limit=100`),
        axios.get(`${API_BASE}/reviews/timeline`),
        axios.get(`${API_BASE}/reviews/heatmap`),
        axios.get(`${API_BASE}/analytics/sentiment`),
        axios.get(`${API_BASE}/analytics/geographic`),
        axios.get(`${API_BASE}/analytics/categories`),
        axios.get(`${API_BASE}/users/engagement`)
      ]);

      setStats(statsRes.data);
      setBusinesses(businessesRes.data.data);
      setTimeline(timelineRes.data);
      setHeatmapData(heatmapRes.data);
      setSentiment(sentimentRes.data);
      setGeographic(geoRes.data);
      setCategories(categoriesRes.data);
      setEngagement(engagementRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Make sure backend is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all' && filters[key] !== '0') {
          params.append(key, filters[key]);
        }
      });

      const businessesRes = await axios.get(`${API_BASE}/businesses?${params.toString()}&limit=100`);
      setBusinesses(businessesRes.data.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: 'all',
      category: 'all',
      minRating: '0',
      timeRange: 'all',
      search: ''
    });
  };

  const exportData = async () => {
    try {
      const response = await axios.post(`${API_BASE}/export`, {
        type: 'businesses',
        filters
      });
      alert('Export initiated! Check your downloads folder.');
      console.log('Export response:', response.data);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data.');
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="App">
      <Navbar stats={stats} />
      
      <main className="main-container">
        <Hero />
        
        <ControlPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          onExport={exportData}
        />
        
        <KPICards stats={stats} />
        
        <div className="viz-grid">
          <RatingHeatmap data={heatmapData} />
          <TimelineChart data={timeline} />
          <TopBusinesses businesses={businesses} />
          <ScatterPlot businesses={businesses} />
          <GeographicMap data={geographic} />
          <CategoryChart data={categories} />
          <SentimentAnalysis data={sentiment} />
          <UserEngagement data={engagement} />
        </div>
        
        <DataTable businesses={businesses} />
        <InsightsPanel />
        <Footer />
      </main>
    </div>
  );
}

export default App;