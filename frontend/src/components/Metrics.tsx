import { useEffect, useState } from "react";
import { fetchMetrics } from "../api/ToDoApi";

interface MetricsInt {
  overall: string;
  doneCount: number;
  byPriority: Record<string, string>;
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<MetricsInt | null>(null);

  useEffect(() => {
    fetchMetrics()
      .then((data: MetricsInt) => setMetrics(data))
      .catch(error => console.error("Error fetching metrics:", error));
  }, []);

  if (!metrics) return <div style={errorStyle}>Error loading metrics.</div>;

  return (
    <div style={metricsContainerStyle}>
      <h2 style={metricsTitleStyle}>Task Metrics</h2>
      <div style={metricItemStyle}>
        <strong style={strongStyle}>Average time to finish tasks:</strong>
        <span style={valueStyle}>{metrics.overall}</span>
      </div>
      <div style={metricItemStyle}>
        <strong style={strongStyle}>Total tasks completed:</strong>
        <span style={valueStyle}>{metrics.doneCount}</span>
      </div>
      <div>
        <h3 style={priorityTitleStyle}>Average time by priority:</h3>
        <ul style={priorityListStyle}>
          {Object.entries(metrics.byPriority).map(([priority, time]) => (
            <li key={priority} style={priorityItemStyle}>
              <span style={priorityLabelStyle}>{priority.charAt(0).toUpperCase() + priority.slice(1)}:</span>
              <span style={priorityValueStyle}>{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const metricsContainerStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  marginTop: '2rem',
};

const metricsTitleStyle = {
  color: '#333',
  fontSize: '1.75rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  borderBottom: '2px solid #eee',
  paddingBottom: '0.75rem',
};

const metricItemStyle = {
  marginBottom: '1rem',
  fontSize: '1rem',
};

const strongStyle = {
  fontWeight: 'bold',
  color: '#555',
  marginRight: '0.5rem',
};

const valueStyle = {
  color: '#007bff',
};

const priorityTitleStyle = {
  color: '#333',
  fontSize: '1.25rem',
  marginTop: '1.5rem',
  marginBottom: '0.75rem',
};

const priorityListStyle = {
  listStyleType: 'none',
  padding: 0,
};

const priorityItemStyle = {
  padding: '0.5rem 0',
  borderBottom: '1px dashed #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const priorityLabelStyle = {
  color: '#777',
};

const priorityValueStyle = {
  color: '#28a745',
  fontWeight: 'bold',
};

const errorStyle = {
  color: '#dc3545',
  padding: '1rem',
  backgroundColor: '#f8d7da',
  borderRadius: '4px',
  border: '1px solid #f5c6cb',
};