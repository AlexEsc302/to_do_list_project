import { useEffect, useState } from "react";
import { TodoApi } from "../api/ToDoApi";
import { TodoMetrics } from "../types/ToDo";

interface MetricsInt extends TodoMetrics {
  overall: string;
  doneCount: number;
  byPriority: Record<string, string>;
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<MetricsInt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    TodoApi.fetchMetrics()
      .then((data: MetricsInt) => {
        setMetrics(data);
        setError(null);
      })
      .catch((error: unknown) => {
        console.error("Error fetching metrics:", error);
        setError(error instanceof Error ? error.message : 'Failed to load metrics');
        setMetrics(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={loadingStyle}>Loading metrics...</div>;
  }

  if (error) {
    return <div style={errorBoxStyle}>{error}</div>;
  }

  if (!metrics) {
    return <div style={errorBoxStyle}>No metrics available.</div>;
  }

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

const loadingStyle = {
  padding: '1rem',
  textAlign: 'center' as const,
  color: '#666',
};

const errorBoxStyle = {
  padding: '1rem',
  textAlign: 'center' as const,
  color: '#dc3545',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  marginTop: '2rem',
};

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