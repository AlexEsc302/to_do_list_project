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
  }, []);


  if (!metrics) return <div>Error</div>;

  return (
    <div >
      <p><strong>Average time to finish tasks:</strong> {metrics.overall}</p>
      <p><strong>ToDos done:</strong> {metrics.doneCount}</p>
      <div>
        <h3 >Average time to finish tasks by priority:</h3>
        <ul >
          {Object.entries(metrics.byPriority).map(([priority, time]) => (
            <li key={priority}>
              <span >{priority.toLowerCase()}:</span> {time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}