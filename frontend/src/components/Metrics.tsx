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
    return <div className="metrics-loading">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span>Loading metrics...</span>
    </div>;
  }

  if (error) {
    return <div className="metrics-error">
      <i className="fas fa-exclamation-circle me-2"></i>
      {error}
    </div>;
  }

  if (!metrics) {
    return <div className="metrics-error">
      <i className="fas fa-info-circle me-2"></i>
      No metrics available.
    </div>;
  }

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <i className="fas fa-chart-bar metrics-icon"></i>
        <h2 className="metrics-title">Task Metrics</h2>
      </div>

      <div className="metrics-summary">
        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Average Time to Complete</div>
            <div className="metric-value">{metrics.overall}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-label">Tasks Completed</div>
            <div className="metric-value">{metrics.doneCount}</div>
          </div>
        </div>
      </div>

      <div className="metrics-detail">
        <h3 className="metrics-subtitle">
          <i className="fas fa-clock me-2"></i>
          Average Time by Priority
        </h3>
        
        <div className="priority-metrics">
          {Object.entries(metrics.byPriority).map(([priority, time]) => {
            const priorityClass = `priority-${priority.toLowerCase()}`;
            return (
              <div key={priority} className={`priority-metric-item ${priorityClass}`}>
                <div className="priority-info">
                  <div className="priority-dot"></div>
                  <span className="priority-name">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                </div>
                <div className="priority-time">{time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}