'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button } from "@repo/design-system";
import type {
  RenderPayload,
  RendererToParentMessage,
} from "@repo/runtime-protocol";
import type { UiNode } from "@repo/ui-runtime";
import type { VideoNode } from "@repo/video-runtime";
import styles from "./page.module.css";

const rendererUrl =
  process.env.NEXT_PUBLIC_RENDERER_URL ?? "http://localhost:4749/embed";
const previewWidthStorageKey = "parent-preview-width";

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
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [payloadKey, setPayloadKey] = useState<PayloadSelection>("ui-spec");
  const [payload, setPayload] = useState<RenderPayload>(payloadOptions["ui-spec"]);
  const [rawPayload, setRawPayload] = useState(
    JSON.stringify(payloadOptions["ui-spec"], null, 2),
  );
  const [rendererReady, setRendererReady] = useState(false);
  const [supportedKinds, setSupportedKinds] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(720);
  const [previewWidth, setPreviewWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const targetOrigin = useMemo(() => {
    try {
      return new URL(rendererUrl, window.location.href).origin;
    } catch {
      return "*";
    }
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
    },
    [targetOrigin],
  );

  useEffect(() => {
    const handler = (event: MessageEvent<RendererToParentMessage>) => {
      const message = event.data;
      if (!message || typeof message !== "object") return;
      if (!("type" in message)) return;

      if (message.type === "renderer:ready") {
        setRendererReady(true);
        setSupportedKinds(message.supportedKinds);
        sendPayload(payload);
      }

      if (message.type === "renderer:resize") {
        setIframeHeight(message.height);
      }

      if (message.type === "renderer:error") {
        setLastError(message.message);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [payload, sendPayload]);

  const handleSelect = (key: PayloadKey) => {
    setPayloadKey(key);
    const next = payloadOptions[key];
    setPayload(next);
    setRawPayload(JSON.stringify(next, null, 2));
    if (rendererReady) sendPayload(next);
  };

  const parseRawPayload = () => JSON.parse(rawPayload) as RenderPayload;

  const applyJson = () => {
    try {
      const parsed = parseRawPayload();
      setPayload(parsed);
      setPayloadKey("custom");
      if (rendererReady) sendPayload(parsed);
      setLastError(null);
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const sendCurrentPayload = () => {
    try {
      const parsed = parseRawPayload();
      setPayload(parsed);
      setPayloadKey("custom");
      if (rendererReady) sendPayload(parsed);
      setLastError(null);
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  useEffect(() => {
    const savedWidth = window.localStorage.getItem(previewWidthStorageKey);
    if (!savedWidth) {
      return;
    }

    const parsedWidth = Number(savedWidth);
    if (Number.isFinite(parsedWidth)) {
      setPreviewWidth(Math.min(75, Math.max(35, parsedWidth)));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(previewWidthStorageKey, String(previewWidth));
  }, [previewWidth]);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      const shell = shellRef.current;
      if (!shell) {
        return;
      }

      const bounds = shell.getBoundingClientRect();
      const nextWidth = ((bounds.right - event.clientX) / bounds.width) * 100;
      const clampedWidth = Math.min(75, Math.max(35, nextWidth));
      setPreviewWidth(clampedWidth);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, [isResizing]);

  return (
    <div
      ref={shellRef}
      className={styles.shell}
      style={{ ["--preview-width" as string]: `${previewWidth}vw` }}
    >
      <div className={styles.sidebar}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Parent renderer</h1>
            <p className={styles.description}>
              Choose a payload on the left and render it in the fixed iframe on the right.
            </p>
          </div>
          <div className={styles.headerBadge}>
            <Badge
              label={rendererReady ? "Renderer ready" : "Waiting for renderer"}
              tone={rendererReady ? "success" : "warning"}
            />
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Payload</h2>
          </div>
          <div className={styles.modeGrid}>
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
          </div>
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span>Status</span>
              <span>{rendererReady ? "Ready" : "Waiting"}</span>
            </div>
            <div className={styles.metaRow}>
              <span>Iframe height</span>
              <span>{iframeHeight}px</span>
            </div>
            <div className={styles.metaRow}>
              <span>Renderer</span>
              <span className={styles.metaValue}>{rendererUrl}</span>
            </div>
          </div>
          {!!supportedKinds.length && (
            <div className={styles.badges}>
              {supportedKinds.map((kind) => (
                <Badge key={kind} label={kind} />
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>JSON</h2>
          </div>
          <textarea
            className={styles.editor}
            value={rawPayload}
            onChange={(event) => setRawPayload(event.target.value)}
          />
          <div className={styles.actions}>
            <Button label="Apply JSON" variant="primary" onClick={applyJson} />
            <Button label="Send to renderer" onClick={sendCurrentPayload} />
          </div>
          {lastError ? <div className={styles.error}>{lastError}</div> : null}
        </section>
      </div>

      <button
        type="button"
        aria-label="Resize preview panel"
        className={styles.handle}
        onMouseDown={() => setIsResizing(true)}
      />

      <div className={styles.preview}>
        <iframe
          ref={iframeRef}
          src={rendererUrl}
          title="Renderer preview"
          className={styles.frame}
        />
      </div>
    </div>
  );
}
