"use client";

import React from "react";
import { RenderPayload } from "@user-content/runtime-protocol";
import { IframeRenderer } from "@/components/IframeRenderer";

const RENDERER_URL = process.env.NEXT_PUBLIC_RENDERER_URL || "http://localhost:7318/embed";

const uiSpecExample: RenderPayload = {
  kind: "ui",
  mode: "spec",
  spec: {
    type: "Page",
    children: [
      {
        type: "Text",
        props: {
          variant: "h1",
          children: "Dashboard Example",
        },
      },
      {
        type: "Grid",
        props: {
          columns: 3,
          gap: 16,
        },
        children: [
          {
            type: "Card",
            props: {
              title: "Total Users",
            },
            children: [
              {
                type: "Metric",
                props: {
                  value: "1,234",
                  label: "Active Users",
                  change: "+12.5%",
                },
              },
            ],
          },
          {
            type: "Card",
            props: {
              title: "Revenue",
            },
            children: [
              {
                type: "Metric",
                props: {
                  value: "$45,678",
                  label: "This Month",
                  change: "+8.3%",
                },
              },
            ],
          },
          {
            type: "Card",
            props: {
              title: "Conversion",
            },
            children: [
              {
                type: "Metric",
                props: {
                  value: "3.2%",
                  label: "Conversion Rate",
                  change: "+0.4%",
                },
              },
            ],
          },
        ],
      },
      {
        type: "Card",
        props: {
          title: "Monthly Revenue",
        },
        children: [
          {
            type: "BarChart",
            props: {
              data: [
                { name: "Jan", value: 4000 },
                { name: "Feb", value: 3000 },
                { name: "Mar", value: 5000 },
                { name: "Apr", value: 4500 },
                { name: "May", value: 6000 },
                { name: "Jun", value: 5500 },
              ],
              dataKey: "value",
              xAxisKey: "name",
            },
          },
        ],
      },
    ],
  },
};

const uiCodeExample: RenderPayload = {
  kind: "ui",
  mode: "code",
  code: `
export default function DashboardFromCode() {
  const data = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  return (
    <Page>
      <Text variant="h1">Dashboard from Code</Text>
      <Grid columns={3} gap={16}>
        <Card title="Total Users">
          <Metric value="1,234" label="Active Users" change="+12.5%" />
        </Card>
        <Card title="Revenue">
          <Metric value="$45,678" label="This Month" change="+8.3%" />
        </Card>
        <Card title="Conversion">
          <Metric value="3.2%" label="Conversion Rate" change="+0.4%" />
        </Card>
      </Grid>
      <Card title="Monthly Revenue">
        <BarChart data={data} dataKey="value" xAxisKey="name" />
      </Card>
    </Page>
  );
}
`.trim(),
};

const videoSpecExample: RenderPayload = {
  kind: "video",
  mode: "spec",
  fps: 30,
  durationInFrames: 150,
  width: 1280,
  height: 720,
  spec: {
    type: "AbsoluteFill",
    children: [
      {
        type: "Sequence",
        props: {
          from: 0,
          durationInFrames: 60,
        },
        children: [
          {
            type: "TitleScene",
            props: {
              title: "Welcome",
              subtitle: "Dynamic Video Generation",
            },
          },
        ],
      },
      {
        type: "Sequence",
        props: {
          from: 60,
          durationInFrames: 90,
        },
        children: [
          {
            type: "MetricScene",
            props: {
              value: 1234,
              label: "Active Users",
              change: "+12.5%",
            },
          },
        ],
      },
    ],
  },
};

const videoCodeExample: RenderPayload = {
  kind: "video",
  mode: "code",
  fps: 30,
  durationInFrames: 150,
  width: 1280,
  height: 720,
  code: `
export default function CodeVideo() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60}>
        <TitleScene title="Welcome from Code" subtitle="Dynamic Video Generation" />
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <MetricScene value={1234} label="Active Users" change="+12.5%" />
      </Sequence>
    </AbsoluteFill>
  );
}
`.trim(),
};

const examples = [
  { key: "none", label: "None" },
  { key: "ui-spec", label: "UI Spec" },
  { key: "ui-code", label: "UI Code" },
  { key: "video-spec", label: "Video Spec" },
  { key: "video-code", label: "Video Code" },
] as const;

const examplePayloads: Record<string, RenderPayload> = {
  "ui-spec": uiSpecExample,
  "ui-code": uiCodeExample,
  "video-spec": videoSpecExample,
  "video-code": videoCodeExample,
};

export default function HomePage() {
  const [payload, setPayload] = React.useState<RenderPayload | null>(null);
  const [selectedExample, setSelectedExample] = React.useState<string>("none");
  const [error, setError] = React.useState<string | null>(null);
  const [leftWidth, setLeftWidth] = React.useState(50);
  const [editorText, setEditorText] = React.useState<string>("");
  const [editorError, setEditorError] = React.useState<string | null>(null);
  const isDragging = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleExampleChange = (example: string) => {
    setSelectedExample(example);
    setError(null);
    setEditorError(null);
    const p = examplePayloads[example] ?? null;
    setPayload(p);
    setEditorText(p ? JSON.stringify(p, null, 2) : "");
  };

  const handleApplyPayload = () => {
    try {
      const parsed = JSON.parse(editorText) as RenderPayload;
      if (!parsed.kind || !parsed.mode) {
        throw new Error("Payload must have 'kind' and 'mode' fields");
      }
      setPayload(parsed);
      setSelectedExample("custom");
      setError(null);
      setEditorError(null);
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : String(err));
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(80, Math.max(20, pct)));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left Panel - Controls */}
      <div
        style={{
          width: `${leftWidth}%`,
          height: "100%",
          overflow: "auto",
          padding: "1.5rem",
          boxSizing: "border-box",
          borderRight: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <header style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.25rem" }}>User Content</h1>
          <p style={{ color: "#666", margin: 0, fontSize: "0.875rem" }}>
            Generate and preview dynamic UI and video content
          </p>
        </header>

        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Select Example</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {examples.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleExampleChange(key)}
                style={{
                  padding: "0.625rem 1rem",
                  backgroundColor: selectedExample === key ? "#007bff" : "#fff",
                  color: selectedExample === key ? "#fff" : "#333",
                  border: `1px solid ${selectedExample === key ? "#007bff" : "#ddd"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "0.75rem",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "6px",
            }}
          >
            <h3 style={{ color: "#c00", margin: "0 0 0.25rem", fontSize: "0.875rem" }}>Error</h3>
            <p style={{ margin: 0, fontSize: "0.8125rem" }}>{error}</p>
          </div>
        )}

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "1rem", margin: 0 }}>Payload</h2>
            <button
              onClick={handleApplyPayload}
              disabled={!editorText.trim()}
              style={{
                padding: "0.375rem 0.75rem",
                backgroundColor: editorText.trim() ? "#28a745" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: editorText.trim() ? "pointer" : "default",
                fontSize: "0.8125rem",
              }}
            >
              Apply
            </button>
          </div>
          {editorError && (
            <p style={{ color: "#c00", fontSize: "0.8125rem", margin: "0 0 0.5rem" }}>{editorError}</p>
          )}
          <textarea
            value={editorText}
            onChange={(e) => {
              setEditorText(e.target.value);
              setEditorError(null);
            }}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: "300px",
              padding: "0.75rem",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              resize: "vertical",
              boxSizing: "border-box",
            }}
            placeholder='Enter a JSON payload, e.g. {"kind":"ui","mode":"spec","spec":{...}}'
          />
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={startDrag}
        style={{
          width: "6px",
          cursor: "col-resize",
          backgroundColor: "#e0e0e0",
          flexShrink: 0,
          transition: "background-color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bbb")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
      />

      {/* Right Panel - Iframe */}
      <div
        style={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {payload ? (
          <IframeRenderer
            rendererUrl={RENDERER_URL}
            payload={payload}
            onReady={() => console.log("Renderer ready")}
            onResize={(height) => console.log("Renderer resize:", height)}
            onError={(message, recoverable) => {
              console.error("Renderer error:", message, "recoverable:", recoverable);
              setError(message);
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <p style={{ color: "#999", fontSize: "1.125rem" }}>
              Select an example to preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
