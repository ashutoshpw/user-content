import React from "react";
import {
  Page,
  Stack,
  Row,
  Grid,
  Card,
  Text,
  Button,
  Badge,
  Divider,
  Image,
  Table,
  Metric,
  Tabs,
} from "@user-content/design-system";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ChartProps {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xAxisKey?: string;
  className?: string;
}

export const BarChartComponent: React.FC<ChartProps> = ({
  data,
  dataKey,
  xAxisKey = "name",
  className = "",
}) => {
  return (
    <div className={className} style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChartComponent: React.FC<ChartProps> = ({
  data,
  dataKey,
  xAxisKey = "name",
  className = "",
}) => {
  return (
    <div className={className} style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChartComponent: React.FC<ChartProps> = ({
  data,
  dataKey,
  xAxisKey = "name",
  className = "",
}) => {
  return (
    <div className={className} style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey={dataKey} fill="#007bff" stroke="#007bff" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const uiRegistry = {
  Page,
  Stack,
  Row,
  Grid,
  Card,
  Text,
  Button,
  Badge,
  Divider,
  Image,
  Table,
  BarChart: BarChartComponent,
  LineChart: LineChartComponent,
  AreaChart: AreaChartComponent,
  Metric,
  Tabs,
} as const;

export type UiRegistryType = typeof uiRegistry;
export type ComponentName = keyof UiRegistryType;
