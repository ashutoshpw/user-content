"use client";

import React from "react";
import { RenderPayload } from "@user-content/runtime-protocol";
import { IframeRenderer } from "@/components/IframeRenderer";

const RENDERER_URL = process.env.NEXT_PUBLIC_RENDERER_URL || "http://localhost:3001/embed";

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

export default function HomePage() {
  const [payload, setPayload] = React.useState<RenderPayload | null>(null);
  const [selectedExample, setSelectedExample] = React.useState<string>("none");
  const [error, setError] = React.useState<string | null>(null);

  const handleExampleChange = (example: string) => {
    setSelectedExample(example);
    setError(null);

    switch (example) {
      case "ui-spec":
        setPayload(uiSpecExample);
        break;
      case "video-spec":
        setPayload(videoSpecExample);
        break;
      default:
        setPayload(null);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>User Content - Parent App</h1>
        <p style={{ color: "#666" }}>
          Generate and preview dynamic UI and video content in the iframe below
        </p>
      </header>

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Select an Example</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => handleExampleChange("none")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: selectedExample === "none" ? "#007bff" : "#fff",
              color: selectedExample === "none" ? "#fff" : "#333",
              border: "1px solid #007bff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            None
          </button>
          <button
            onClick={() => handleExampleChange("ui-spec")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: selectedExample === "ui-spec" ? "#007bff" : "#fff",
              color: selectedExample === "ui-spec" ? "#fff" : "#333",
              border: "1px solid #007bff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            UI Spec (Dashboard)
          </button>
          <button
            onClick={() => handleExampleChange("video-spec")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: selectedExample === "video-spec" ? "#007bff" : "#fff",
              color: selectedExample === "video-spec" ? "#fff" : "#333",
              border: "1px solid #007bff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Video Spec (Animation)
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#c00", marginBottom: "0.5rem" }}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Renderer Output</h2>
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
              padding: "4rem",
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p style={{ color: "#666", fontSize: "1.125rem" }}>
              Select an example above to see the renderer in action
            </p>
          </div>
        )}
      </div>

      {payload && (
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Current Payload</h2>
          <pre
            style={{
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "0.875rem",
            }}
          >
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
