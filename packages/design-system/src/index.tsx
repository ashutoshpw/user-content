'use client';

import type { CSSProperties, ReactNode } from "react";
import React, { useMemo, useState } from "react";
import clsx from "clsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles.css";

export type PageProps = {
  title?: string;
  description?: string;
  padding?: number;
  background?: string;
  breadcrumbs?: string[];
  children?: ReactNode;
  headerExtra?: ReactNode;
};

export const Page: React.FC<PageProps> = ({
  title,
  description,
  padding = 32,
  background,
  breadcrumbs,
  headerExtra,
  children,
}) => {
  return (
    <div
      className={clsx("ds-page", "ds-grid")}
      style={background ? { background } : undefined}
    >
      <div className="ds-card ds-surface" style={{ padding }}>
        <div style={{ display: "grid", gap: 16 }}>
          {(title || description || breadcrumbs?.length) && (
            <header style={{ display: "grid", gap: 10 }}>
              {breadcrumbs?.length ? (
                <div className="ds-breadcrumbs">
                  {breadcrumbs.join(" / ")}
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  {title ? <h1 className="ds-title">{title}</h1> : null}
                  {description ? (
                    <p className="ds-muted" style={{ maxWidth: 720 }}>
                      {description}
                    </p>
                  ) : null}
                </div>
                {headerExtra}
              </div>
            </header>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

type LayoutProps = {
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  children?: ReactNode;
  wrap?: boolean;
  style?: CSSProperties;
};

export const Stack: React.FC<LayoutProps> = ({
  gap = 16,
  align = "stretch",
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap,
      alignItems: align === "stretch" ? "stretch" : align,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Row: React.FC<LayoutProps> = ({
  gap = 12,
  align = "center",
  wrap = true,
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: wrap ? "wrap" : "nowrap",
      gap,
      alignItems: align === "stretch" ? "stretch" : align,
      ...style,
    }}
  >
    {children}
  </div>
);

export type GridProps = {
  columns?: number;
  gap?: number;
  minColumnWidth?: number;
  children?: ReactNode;
};

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = 16,
  minColumnWidth = 260,
  children,
}) => (
  <div
    style={{
      display: "grid",
      gap,
      gridTemplateColumns: columns
        ? `repeat(${columns}, minmax(${minColumnWidth}px, 1fr))`
        : `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
      alignItems: "stretch",
    }}
  >
    {children}
  </div>
);

export type CardProps = {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  bleed?: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  footer,
  actions,
  children,
  bleed,
}) => (
  <div
    className={clsx("ds-card", "ds-surface")}
    style={bleed ? { padding: 0, overflow: "hidden" } : undefined}
  >
    <div style={{ display: "grid", gap: 12 }}>
      {(title || subtitle || actions) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            {title ? <h3 className="ds-title">{title}</h3> : null}
            {subtitle ? <p className="ds-muted">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
      )}
      {children}
      {footer ? <div className="ds-muted">{footer}</div> : null}
    </div>
  </div>
);

export type TextProps = {
  value: string | number;
  variant?: "display" | "title" | "subtitle" | "body" | "caption";
  align?: "left" | "center" | "right";
  muted?: boolean;
};

export const Text: React.FC<TextProps> = ({
  value,
  variant = "body",
  align = "left",
  muted,
}) => {
  const Tag =
    variant === "display"
      ? "h1"
      : variant === "title"
        ? "h2"
        : variant === "subtitle"
          ? "h4"
          : variant === "caption"
            ? "small"
            : "p";

  const fontSize =
    variant === "display"
      ? 36
      : variant === "title"
        ? 24
        : variant === "subtitle"
          ? 18
          : variant === "caption"
            ? 12
            : 15;

  return (
    <Tag
      className={clsx(muted && "ds-muted", "ds-title")}
      style={{
        fontSize,
        fontWeight: variant === "body" ? 500 : 700,
        margin: 0,
        textAlign: align,
      }}
    >
      {value}
    </Tag>
  );
};

export type ButtonProps = {
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "ghost",
  onClick,
}) => (
  <button
    className={clsx("ds-button", variant)}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

export type BadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  tone = "neutral",
}) => (
  <span className="ds-badge" data-tone={tone === "neutral" ? undefined : tone}>
    {label}
  </span>
);

export const Divider: React.FC = () => <hr className="ds-divider" />;

export type ImageProps = {
  src: string;
  alt?: string;
  height?: number;
  width?: number | string;
  radius?: number;
  fit?: "cover" | "contain";
};

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  height = 180,
  width = "100%",
  radius = 10,
  fit = "cover",
}) => (
  <img
    src={src}
    alt={alt ?? ""}
    style={{
      width,
      height,
      objectFit: fit,
      borderRadius: radius,
      border: "1px solid var(--ds-border)",
    }}
  />
);

export type TableColumn = { key: string; label: string };
export type TableProps = {
  columns: TableColumn[];
  rows: Array<Record<string, string | number>>;
};

export const Table: React.FC<TableProps> = ({ columns, rows }) => (
  <div className="ds-surface ds-card" style={{ overflowX: "auto" }}>
    <table className="ds-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key] as ReactNode}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export type MetricProps = {
  label: string;
  value: string | number;
  delta?: number;
  unit?: string;
};

export const Metric: React.FC<MetricProps> = ({ label, value, delta, unit }) => {
  const formattedDelta =
    delta === undefined
      ? null
      : `${delta >= 0 ? "+" : ""}${delta}${unit ? unit : "%"}`;
  const deltaTone =
    delta === undefined
      ? "neutral"
      : delta > 0
        ? "success"
        : delta < 0
          ? "danger"
          : "neutral";
  return (
    <div className="ds-card ds-surface ds-metric">
      <div className="ds-muted">{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ds-title" style={{ fontSize: 28 }}>
          {value}
          {unit && delta === undefined ? unit : ""}
        </span>
        {formattedDelta ? (
          <Badge
            label={formattedDelta}
            tone={deltaTone}
          />
        ) : null}
      </div>
    </div>
  );
};

export type TabsProps = {
  tabs: Array<{ id: string; label: string; content: ReactNode }>;
  activeId?: string;
  onChange?: (id: string) => void;
};

export const Tabs: React.FC<TabsProps> = ({ tabs, activeId, onChange }) => {
  const initial = activeId ?? (tabs[0]?.id ?? "");
  const [current, setCurrent] = useState(initial);

  const active = tabs.find((tab) => tab.id === current) ?? tabs[0];

  const handleChange = (id: string) => {
    setCurrent(id);
    onChange?.(id);
  };

  return (
    <div className="ds-tabs">
      <div className="ds-tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="ds-tab"
            data-active={tab.id === active?.id}
            onClick={() => handleChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ds-card ds-surface">{active?.content}</div>
    </div>
  );
};

type ChartProps = {
  title?: string;
  subtitle?: string;
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKeys: string[];
  height?: number;
  stacked?: boolean;
};

const ChartShell: React.FC<
  ChartProps & { children: ReactNode; type: "bar" | "line" | "area" }
> = ({ title, subtitle, height = 240, children }) => (
  <Card title={title} subtitle={subtitle} bleed>
    <div style={{ padding: "8px 12px 12px" }}>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);

export const BarChartCard: React.FC<ChartProps> = (props) => {
  const colors = useMemo(
    () => ["#5df1c8", "#9b8bff", "#f6c344", "#78a6ff"],
    [],
  );
  return (
    <ChartShell {...props} type="bar">
      <BarChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-grid)" />
        <XAxis dataKey={props.xKey} stroke="var(--ds-muted)" />
        <YAxis stroke="var(--ds-muted)" />
        <Tooltip />
        <Legend />
        {props.yKeys.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={props.stacked ? "stack" : undefined}
            fill={colors[idx % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartShell>
  );
};

export const LineChartCard: React.FC<ChartProps> = (props) => {
  const colors = useMemo(
    () => ["#5df1c8", "#9b8bff", "#f6c344", "#78a6ff"],
    [],
  );
  return (
    <ChartShell {...props} type="line">
      <LineChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-grid)" />
        <XAxis dataKey={props.xKey} stroke="var(--ds-muted)" />
        <YAxis stroke="var(--ds-muted)" />
        <Tooltip />
        <Legend />
        {props.yKeys.map((key, idx) => (
          <Line
            key={key}
            dataKey={key}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={false}
            type="monotone"
          />
        ))}
      </LineChart>
    </ChartShell>
  );
};

export const AreaChartCard: React.FC<ChartProps> = (props) => {
  const colors = useMemo(
    () => ["#5df1c8", "#9b8bff", "#f6c344", "#78a6ff"],
    [],
  );
  return (
    <ChartShell {...props} type="area">
      <AreaChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-grid)" />
        <XAxis dataKey={props.xKey} stroke="var(--ds-muted)" />
        <YAxis stroke="var(--ds-muted)" />
        <Tooltip />
        <Legend />
        {props.yKeys.map((key, idx) => (
          <Area
            key={key}
            dataKey={key}
            stroke={colors[idx % colors.length]}
            fillOpacity={0.25}
            fill={colors[idx % colors.length]}
            type="monotone"
          />
        ))}
      </AreaChart>
    </ChartShell>
  );
};
