import React from "react";

export interface PageProps {
  children?: React.ReactNode;
  className?: string;
}

export const Page: React.FC<PageProps> = ({ children, className = "" }) => {
  return (
    <div className={`page ${className}`} style={{ padding: "1rem" }}>
      {children}
    </div>
  );
};

export interface StackProps {
  children?: React.ReactNode;
  spacing?: number;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({ children, spacing = 16, className = "" }) => {
  return (
    <div
      className={`stack ${className}`}
      style={{ display: "flex", flexDirection: "column", gap: `${spacing}px` }}
    >
      {children}
    </div>
  );
};

export interface RowProps {
  children?: React.ReactNode;
  spacing?: number;
  className?: string;
}

export const Row: React.FC<RowProps> = ({ children, spacing = 16, className = "" }) => {
  return (
    <div
      className={`row ${className}`}
      style={{ display: "flex", flexDirection: "row", gap: `${spacing}px` }}
    >
      {children}
    </div>
  );
};

export interface GridProps {
  children?: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, columns = 2, gap = 16, className = "" }) => {
  return (
    <div
      className={`grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = "" }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "1rem",
        backgroundColor: "#fff",
      }}
    >
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
};

export interface TextProps {
  children?: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption";
  className?: string;
}

export const Text: React.FC<TextProps> = ({ children, variant = "body", className = "" }) => {
  const styles: Record<string, React.CSSProperties> = {
    h1: { fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" },
    h2: { fontSize: "1.5rem", fontWeight: "bold", margin: "0.5rem 0" },
    h3: { fontSize: "1.25rem", fontWeight: "bold", margin: "0.5rem 0" },
    h4: { fontSize: "1rem", fontWeight: "bold", margin: "0.5rem 0" },
    body: { fontSize: "1rem", margin: "0.25rem 0" },
    caption: { fontSize: "0.875rem", color: "#666", margin: "0.25rem 0" },
  };

  const Tag = variant.startsWith("h") ? variant : "p";
  return React.createElement(Tag, { className, style: styles[variant] }, children);
};

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
    },
    secondary: {
      backgroundColor: "#6c757d",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#007bff",
      border: "1px solid #007bff",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <button className={className} style={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
};

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const styles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: "#e0e0e0", color: "#333" },
    success: { backgroundColor: "#28a745", color: "#fff" },
    warning: { backgroundColor: "#ffc107", color: "#333" },
    error: { backgroundColor: "#dc3545", color: "#fff" },
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        ...styles[variant],
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.875rem",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

export interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid #e0e0e0",
        margin: "1rem 0",
      }}
    />
  );
};

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt = "", width, height, className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

export interface TableProps {
  headers: string[];
  rows: Array<Array<string | number>>;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, rows, className = "" }) => {
  return (
    <table
      className={className}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #e0e0e0",
      }}
    >
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={i}
              style={{
                backgroundColor: "#f5f5f5",
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export interface MetricProps {
  value: string | number;
  label: string;
  change?: string;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({ value, label, change, className = "" }) => {
  return (
    <div className={className} style={{ padding: "1rem" }}>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.25rem" }}>{label}</div>
      {change && (
        <div style={{ fontSize: "0.875rem", color: "#28a745", marginTop: "0.25rem" }}>
          {change}
        </div>
      )}
    </div>
  );
};

export interface TabsProps {
  tabs: Array<{ label: string; content: React.ReactNode }>;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, className = "" }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={className}>
      <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "0.75rem 1rem",
              border: "none",
              backgroundColor: "transparent",
              borderBottom: activeTab === i ? "2px solid #007bff" : "none",
              color: activeTab === i ? "#007bff" : "#666",
              cursor: "pointer",
              fontWeight: activeTab === i ? "bold" : "normal",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "1rem" }}>{tabs[activeTab]?.content}</div>
    </div>
  );
};
