"use client";

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  unit: string;
  subtitle: string;
  isAlert?: boolean;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  isAlert = false,
}: StatCardProps) {
  return (
    <div className={`stat-card ${isAlert ? "stat-alert" : ""}`}>
      <div className="stat-header">
        <span>{title}</span>
      </div>
      <div className="stat-value-container">
        <span className="stat-value">{value ?? 0}</span>
        <span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-footer">{subtitle}</div>

      <style jsx>{`
        .stat-card {
          background-color: #f0f8ff;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid #e2e8f0;
        }

        .stat-alert {
          background-color: #fff5f5;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .stat-value-container {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .stat-unit {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .stat-footer {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}