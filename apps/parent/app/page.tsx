'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Metric,
  Page,
  Row,
  Stack,
  Table,
  Text,
} from "@repo/design-system";
import type {
  RenderPayload,
  RendererToParentMessage,
} from "@repo/runtime-protocol";
import type { UiNode } from "@repo/ui-runtime";
import type { VideoNode } from "@repo/video-runtime";

const rendererUrl =
  process.env.NEXT_PUBLIC_RENDERER_URL ?? "http://localhost:3001/embed";

const uiSpecSample: UiNode = {
  type: "Page",
  props: {
    title: "Autonomous Ops Dashboard",
    description:
      "Generated UI spec rendered inside a stable iframe host. Resize & errors are streamed back to the parent.",
    breadcrumbs: ["Sessions", "Realtime"],
  },
  children: [
    {
      type: "Grid",
      props: { columns: 3, gap: 12 },
      children: [
        {
          type: "Metric",
          props: { label: "Active users", value: "1,248", delta: 4.2 },
        },
        {
          type: "Metric",
          props: { label: "API latency", value: "182ms", delta: -3.1 },
        },
        {
          type: "Metric",
          props: { label: "Error budget", value: "98.4%", delta: 1.2 },
        },
      ],
    },
    {
      type: "Tabs",
      props: {
        tabs: [
          {
            label: "Overview",
            children: [
              {
                type: "Grid",
                props: { columns: 2, gap: 12 },
                children: [
                  {
                    type: "BarChart",
                    props: {
                      title: "Requests by region",
                      data: [
                        { region: "us-east", app: 2200, batch: 1200 },
                        { region: "us-west", app: 1900, batch: 980 },
                        { region: "eu-west", app: 1500, batch: 780 },
                        { region: "apac", app: 1100, batch: 700 },
                      ],
                      xKey: "region",
                      yKeys: ["app", "batch"],
                      stacked: true,
                    },
                  },
                  {
                    type: "LineChart",
                    props: {
                      title: "Latency (p50/p95)",
                      data: [
                        { ts: "12:00", p50: 180, p95: 310 },
                        { ts: "12:05", p50: 176, p95: 295 },
                        { ts: "12:10", p50: 188, p95: 330 },
                        { ts: "12:15", p50: 170, p95: 280 },
                      ],
                      xKey: "ts",
                      yKeys: ["p50", "p95"],
                    },
                  },
                ],
              },
              {
                type: "Table",
                props: {
                  columns: [
                    { key: "service", label: "Service" },
                    { key: "status", label: "Status" },
                    { key: "slo", label: "SLO" },
                  ],
                  rows: [
                    { service: "ingest", status: "healthy", slo: "99.9%" },
                    { service: "api", status: "degraded", slo: "98.4%" },
                    { service: "etl", status: "healthy", slo: "99.5%" },
                  ],
                },
              },
            ],
          },
          {
            label: "Drill-down",
            children: [
              {
                type: "Grid",
                props: { columns: 2, gap: 12 },
                children: [
                  {
                    type: "AreaChart",
                    props: {
                      title: "Usage growth",
                      data: [
                        { month: "Jan", free: 1200, pro: 300 },
                        { month: "Feb", free: 1500, pro: 420 },
                        { month: "Mar", free: 1800, pro: 640 },
                        { month: "Apr", free: 1950, pro: 820 },
                      ],
                      xKey: "month",
                      yKeys: ["free", "pro"],
                      stacked: true,
                    },
                  },
                  {
                    type: "Card",
                    props: {
                      title: "Next actions",
                      subtitle: "LLM generated guidance",
                    },
                    children: [
                      {
                        type: "Stack",
                        props: { gap: 8 },
                        children: [
                          { type: "Text", props: { value: "• Shift traffic to eu-west" } },
                          { type: "Text", props: { value: "• Warm new cache nodes" } },
                          { type: "Text", props: { value: "• Page on-call only if p95 > 400ms" } },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};

const uiCodeSample = `import { Card, Grid, Metric, BarChartCard, Stack, Text } from "@repo/design-system";

const sample = [
  { region: "us-east", app: 2200, batch: 1200 },
  { region: "us-west", app: 1900, batch: 980 },
  { region: "eu-west", app: 1500, batch: 780 },
  { region: "apac", app: 1100, batch: 700 },
];

export default function Generated() {
  return (
    <Stack gap={14}>
      <Text value="Runtime code mode" variant="title" />
      <Grid columns={2} gap={12}>
        <Metric label="New accounts" value="624" delta={8.2} />
        <Metric label="Churn" value="2.1%" delta={-0.8} />
      </Grid>
      <Card title="Regional mix">
        <BarChartCard data={sample} xKey="region" yKeys={["app", "batch"]} stacked />
      </Card>
    </Stack>
  );
}`;

const videoSpecSample: VideoNode = {
  type: "AbsoluteFill",
  props: { backgroundColor: "#0b1221" },
  children: [
    {
      type: "TitleScene",
      props: {
        title: "Dynamic video preview",
        subtitle: "Generated from video-spec payload",
      },
    },
    {
      type: "Sequence",
      props: { from: 40, durationInFrames: 120 },
      children: [
        {
          type: "ChartBarScene",
          props: {
            title: "Requests by region",
            data: [
              { region: "us-east", app: 2200, batch: 1200 },
              { region: "us-west", app: 1900, batch: 980 },
              { region: "eu-west", app: 1500, batch: 780 },
              { region: "apac", app: 1100, batch: 700 },
            ],
            xKey: "region",
            yKeys: ["app", "batch"],
          },
        },
      ],
    },
    {
      type: "Sequence",
      props: { from: 180, durationInFrames: 100 },
      children: [
        {
          type: "MetricScene",
          props: {
            label: "Activation",
            value: "86.4%",
            delta: 3.4,
            caption: "Week over week",
          },
        },
      ],
    },
  ],
};

const videoCodeSample = `import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card, Text } from "@repo/design-system";

export default function VideoCode() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "#0b1221", color: "white" }}>
      <Card title="Code mode composition" subtitle="Rendered inside Remotion">
        <div style={{ opacity, padding: 24 }}>
          <Text value="LLM generated TSX" variant="title" />
          <Text value="This composition was compiled in the browser and rendered live." variant="body" />
        </div>
      </Card>
    </AbsoluteFill>
  );
}`;

type EventLog = { type: string; message: string; ts: number };
type PayloadKey = "ui-spec" | "ui-code" | "video-spec" | "video-code";
type PayloadSelection = PayloadKey | "custom";

const payloadOptions: Record<PayloadKey, RenderPayload> = {
  "ui-spec": { kind: "ui", mode: "spec", spec: uiSpecSample },
  "ui-code": { kind: "ui", mode: "code", code: uiCodeSample },
  "video-spec": {
    kind: "video",
    mode: "spec",
    fps: 30,
    durationInFrames: 300,
    width: 1280,
    height: 720,
    spec: videoSpecSample,
  },
  "video-code": {
    kind: "video",
    mode: "code",
    fps: 30,
    durationInFrames: 300,
    width: 1280,
    height: 720,
    code: videoCodeSample,
  },
};

export default function ParentHome() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [payloadKey, setPayloadKey] = useState<PayloadSelection>("ui-spec");
  const [payload, setPayload] = useState<RenderPayload>(payloadOptions["ui-spec"]);
  const [rawPayload, setRawPayload] = useState(
    JSON.stringify(payloadOptions["ui-spec"], null, 2),
  );
  const [rendererReady, setRendererReady] = useState(false);
  const [supportedKinds, setSupportedKinds] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(720);
  const [events, setEvents] = useState<EventLog[]>([]);

  const targetOrigin = useMemo(() => {
    try {
      return new URL(rendererUrl, window.location.href).origin;
    } catch {
      return "*";
    }
  }, []);

  const logEvent = useCallback((type: string, message: string) => {
    setEvents((prev) =>
      [{ type, message, ts: Date.now() }, ...prev].slice(0, 12),
    );
  }, []);

  const sendPayload = useCallback(
    (next: RenderPayload) => {
      const target = iframeRef.current?.contentWindow;
      if (!target) return;
      target.postMessage(
        {
          type: "renderer:load",
          version: 1,
          payload: next,
        },
        targetOrigin,
      );
      logEvent("renderer:load", `Sent ${next.kind}-${next.mode} payload`);
    },
    [logEvent, targetOrigin],
  );

  useEffect(() => {
    const handler = (event: MessageEvent<RendererToParentMessage>) => {
      const message = event.data;
      if (!message || typeof message !== "object") return;
      if (!("type" in message)) return;

      if (message.type === "renderer:ready") {
        setRendererReady(true);
        setSupportedKinds(message.supportedKinds);
        logEvent("renderer:ready", "Renderer reported ready");
        sendPayload(payload);
      }

      if (message.type === "renderer:resize") {
        setIframeHeight(message.height);
        logEvent("renderer:resize", `Height -> ${message.height}px`);
      }

      if (message.type === "renderer:error") {
        setLastError(message.message);
        logEvent("renderer:error", message.message);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [payload, sendPayload, logEvent]);

  const handleSelect = (key: PayloadKey) => {
    setPayloadKey(key);
    const next = payloadOptions[key];
    setPayload(next);
    setRawPayload(JSON.stringify(next, null, 2));
    if (rendererReady) sendPayload(next);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(rawPayload) as RenderPayload;
      setPayload(parsed);
      setPayloadKey("custom" as keyof typeof payloadOptions);
      if (rendererReady) sendPayload(parsed);
      setLastError(null);
      logEvent("payload:update", "Applied custom JSON payload");
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  return (
    <Page
      title="Parent ↔ Renderer orchestration"
      description="Load one stable iframe URL, wait for renderer:ready, then stream ui-spec or video-spec payloads. Resize and errors flow back to the parent."
      headerExtra={<Badge label={rendererReady ? "Renderer ready" : "Waiting"} tone={rendererReady ? "success" : "warning"} />}
    >
      <Stack gap={16}>
        <Card
          title="Runtime payloads"
          subtitle="Choose a sample or inject your own JSON payload."
          actions={
            <Row gap={8}>
              <Button
                label="UI spec"
                variant={payloadKey === "ui-spec" ? "primary" : "ghost"}
                onClick={() => handleSelect("ui-spec")}
              />
              <Button
                label="UI code"
                variant={payloadKey === "ui-code" ? "primary" : "ghost"}
                onClick={() => handleSelect("ui-code")}
              />
              <Button
                label="Video spec"
                variant={payloadKey === "video-spec" ? "primary" : "ghost"}
                onClick={() => handleSelect("video-spec")}
              />
              <Button
                label="Video code"
                variant={payloadKey === "video-code" ? "primary" : "ghost"}
                onClick={() => handleSelect("video-code")}
              />
            </Row>
          }
        >
          <Grid columns={2} gap={12}>
            <div>
              <Text value="Payload JSON" variant="subtitle" />
              <textarea
                value={rawPayload}
                onChange={(event) => setRawPayload(event.target.value)}
                style={{
                  width: "100%",
                  minHeight: 280,
                  marginTop: 8,
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--ds-text)",
                  border: "1px solid var(--ds-border)",
                  borderRadius: 12,
                  padding: 12,
                  fontFamily: "ui-monospace, SFMono-Regular",
                }}
              />
              <Row gap={8} style={{ marginTop: 8 }}>
                <Button label="Apply JSON" variant="primary" onClick={applyJson} />
                <Button
                  label="Send to renderer"
                  onClick={() => sendPayload(payload)}
                />
              </Row>
            </div>
            <Stack gap={12}>
              <Text value="Renderer status" variant="subtitle" />
              <Grid columns={2} gap={8}>
                <Metric
                  label="Ready"
                  value={rendererReady ? "Yes" : "No"}
                  delta={rendererReady ? 1 : -1}
                />
                <Metric
                  label="Iframe height"
                  value={`${iframeHeight}px`}
                  delta={0}
                />
              </Grid>
              <Divider />
              <Text value="Supported kinds" variant="caption" muted />
              <Row gap={6}>
                {supportedKinds.map((kind) => (
                  <Badge key={kind} label={kind} />
                ))}
              </Row>
              {lastError ? (
                <Card title="Latest error" subtitle="renderer:error message">
                  <Text value={lastError} />
                </Card>
              ) : null}
            </Stack>
          </Grid>
        </Card>

        <Card title="Renderer iframe" subtitle={rendererUrl}>
          <iframe
            ref={iframeRef}
            src={rendererUrl}
            style={{
              width: "100%",
              border: "1px solid var(--ds-border)",
              borderRadius: 12,
              minHeight: iframeHeight,
              background: "#0b1221",
            }}
          />
        </Card>

        <Card title="Transport events" subtitle="renderer:ready, resize, error">
          <Table
            columns={[
              { key: "type", label: "Type" },
              { key: "message", label: "Message" },
              { key: "ts", label: "Timestamp" },
            ]}
            rows={events.map((event) => ({
              type: event.type,
              message: event.message,
              ts: new Date(event.ts).toLocaleTimeString(),
            }))}
          />
        </Card>
      </Stack>
    </Page>
  );
}
