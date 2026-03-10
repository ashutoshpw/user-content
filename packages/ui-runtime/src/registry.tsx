/* eslint-disable react/prop-types */
import type { ReactNode } from "react";
import {
  AreaChartCard,
  Badge,
  BarChartCard,
  Button,
  Card,
  Divider,
  Grid,
  Image,
  LineChartCard,
  Metric,
  Page,
  Row,
  Stack,
  Table,
  Tabs,
  Text,
} from "@repo/design-system";
import type { UiNodeType } from "./schema";

type UiRenderer = (
  props: Record<string, unknown>,
  children: ReactNode[],
) => ReactNode;

export const uiRegistry: Record<UiNodeType, UiRenderer> = {
  Page: (props, children) => (
    <Page
      title={stringProp(props.title)}
      description={stringProp(props.description)}
      padding={numberProp(props.padding, 32)}
      background={stringProp(props.background)}
      breadcrumbs={arrayProp<string>(props.breadcrumbs)}
      headerExtra={props.headerExtra as ReactNode}
    >
      {children}
    </Page>
  ),
  Stack: (props, children) => (
    <Stack gap={numberProp(props.gap, 16)} align={alignProp(props.align)}>
      {children}
    </Stack>
  ),
  Row: (props, children) => (
    <Row gap={numberProp(props.gap, 12)} align={alignProp(props.align)}>
      {children}
    </Row>
  ),
  Grid: (props, children) => (
    <Grid
      columns={numberProp(props.columns, 3)}
      gap={numberProp(props.gap, 16)}
      minColumnWidth={numberProp(props.minColumnWidth, 260)}
    >
      {children}
    </Grid>
  ),
  Card: (props, children) => (
    <Card
      title={stringProp(props.title)}
      subtitle={stringProp(props.subtitle)}
      footer={props.footer as ReactNode}
      actions={props.actions as ReactNode}
      bleed={booleanProp(props.bleed, false)}
    >
      {children}
    </Card>
  ),
  Text: (props) => (
    <Text
      value={stringOrNumber(props.value, "")}
      variant={variantProp(props.variant)}
      align={alignTextProp(props.align)}
      muted={booleanProp(props.muted, false)}
    />
  ),
  Button: (props) => (
    <Button
      label={stringProp(props.label) ?? "Action"}
      variant={stringProp(props.variant) === "primary" ? "primary" : "ghost"}
      onClick={() => {
        console.info("[ui-runtime] button click", props.label);
        if (typeof props.onClick === "function") {
          (props.onClick as () => void)();
        }
      }}
    />
  ),
  Badge: (props) => (
    <Badge
      label={stringProp(props.label) ?? ""}
      tone={toneProp(props.tone)}
    />
  ),
  Divider: () => <Divider />,
  Image: (props) => (
    <Image
      src={stringProp(props.src) ?? ""}
      alt={stringProp(props.alt) ?? ""}
      height={numberProp(props.height, 180)}
      width={props.width as number | string | undefined}
      radius={numberProp(props.radius, 4)}
      fit={stringProp(props.fit) === "contain" ? "contain" : "cover"}
    />
  ),
  Table: (props) => (
    <Table
      columns={(props.columns as Array<{ key: string; label: string }>) ?? []}
      rows={(props.rows as Array<Record<string, string | number>>) ?? []}
    />
  ),
  BarChart: (props) => (
    <BarChartCard
      title={stringProp(props.title)}
      subtitle={stringProp(props.subtitle)}
      data={(props.data as Array<Record<string, number | string>>) ?? []}
      xKey={stringProp(props.xKey) ?? "label"}
      yKeys={arrayProp<string>(props.yKeys) ?? []}
      stacked={booleanProp(props.stacked, false)}
      height={numberProp(props.height, 240)}
    />
  ),
  LineChart: (props) => (
    <LineChartCard
      title={stringProp(props.title)}
      subtitle={stringProp(props.subtitle)}
      data={(props.data as Array<Record<string, number | string>>) ?? []}
      xKey={stringProp(props.xKey) ?? "label"}
      yKeys={arrayProp<string>(props.yKeys) ?? []}
      height={numberProp(props.height, 240)}
    />
  ),
  AreaChart: (props) => (
    <AreaChartCard
      title={stringProp(props.title)}
      subtitle={stringProp(props.subtitle)}
      data={(props.data as Array<Record<string, number | string>>) ?? []}
      xKey={stringProp(props.xKey) ?? "label"}
      yKeys={arrayProp<string>(props.yKeys) ?? []}
      height={numberProp(props.height, 240)}
      stacked={booleanProp(props.stacked, false)}
    />
  ),
  Metric: (props) => (
    <Metric
      label={stringProp(props.label) ?? "Metric"}
      value={stringOrNumber(props.value, 0)}
      delta={numberProp(props.delta)}
      unit={stringProp(props.unit)}
    />
  ),
  Tabs: (props) => (
    <Tabs tabs={(props.tabs as Array<{ id: string; label: string; content: ReactNode }> | undefined) ?? []} />
  ),
};

function stringProp(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberProp(value: unknown, fallback?: number): number | undefined {
  if (typeof value === "number") return value;
  return fallback;
}

function booleanProp(value: unknown, fallback?: boolean): boolean | undefined {
  if (typeof value === "boolean") return value;
  return fallback;
}

function stringOrNumber(
  value: unknown,
  fallback: string | number,
): string | number {
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function arrayProp<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function alignProp(
  value: unknown,
): "start" | "center" | "end" | "stretch" | undefined {
  if (value === "start" || value === "center" || value === "end") return value;
  if (value === "stretch") return "stretch";
  return undefined;
}

function alignTextProp(
  value: unknown,
): "left" | "center" | "right" | undefined {
  if (value === "left" || value === "center" || value === "right") return value;
  return undefined;
}

function variantProp(
  value: unknown,
): "display" | "title" | "subtitle" | "body" | "caption" | undefined {
  if (
    value === "display" ||
    value === "title" ||
    value === "subtitle" ||
    value === "body" ||
    value === "caption"
  ) {
    return value;
  }
  return undefined;
}

function toneProp(
  value: unknown,
): "neutral" | "success" | "warning" | "danger" | undefined {
  if (value === "success" || value === "warning" || value === "danger") {
    return value;
  }
  return "neutral";
}
