"use client";

import React from "react";
import {
  ParentToRendererMessage,
  RendererToParentMessage,
  RenderPayload,
} from "@user-content/runtime-protocol";
import { validateSpec, RenderNode } from "@user-content/ui-runtime";
import { CodeRuntime, ErrorBoundary } from "@user-content/ui-runtime";
import { Player } from "@remotion/player";
import { DynamicComposition, VideoPayload } from "@user-content/video-runtime";

const ALLOWED_ORIGINS = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
  ? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(",")
  : ["*"];

export default function EmbedPage() {
  const [payload, setPayload] = React.useState<RenderPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sendMessage = React.useCallback((message: RendererToParentMessage) => {
    if (window.parent) {
      window.parent.postMessage(message, "*");
    }
  }, []);

  const sendError = React.useCallback(
    (message: string, recoverable = false) => {
      setError(message);
      sendMessage({
        type: "renderer:error",
        version: 1,
        message,
        recoverable,
      });
    },
    [sendMessage]
  );

  React.useEffect(() => {
    sendMessage({
      type: "renderer:ready",
      version: 1,
      supportedKinds: ["ui", "video"],
    });
  }, [sendMessage]);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const isAllowedOrigin = ALLOWED_ORIGINS.some((origin) => {
        if (origin === "*") return true;
        return event.origin === origin || event.origin.startsWith(origin);
      });

      if (!isAllowedOrigin) {
        console.warn("Rejected message from unauthorized origin:", event.origin);
        return;
      }

      const message = event.data as ParentToRendererMessage;

      if (message.type === "renderer:load") {
        setError(null);
        setPayload(message.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        sendMessage({
          type: "renderer:resize",
          version: 1,
          height: Math.max(height, 100),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [sendMessage]);

  const renderContent = () => {
    if (!payload) {
      return (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "#666",
          }}
        >
          Waiting for payload...
        </div>
      );
    }

    try {
      if (payload.kind === "ui") {
        if (payload.mode === "spec") {
          const validatedSpec = validateSpec(payload.spec);
          return (
            <ErrorBoundary>
              <RenderNode node={validatedSpec} />
            </ErrorBoundary>
          );
        } else if (payload.mode === "code") {
          return (
            <ErrorBoundary>
              <CodeRuntime code={payload.code} />
            </ErrorBoundary>
          );
        }
      } else if (payload.kind === "video") {
        const videoPayload: VideoPayload = {
          fps: payload.fps,
          durationInFrames: payload.durationInFrames,
          width: payload.width,
          height: payload.height,
          spec: payload.mode === "spec" ? (payload.spec as any) : undefined,
          code: payload.mode === "code" ? payload.code : undefined,
        };

        return (
          <div style={{ width: "100%", maxWidth: payload.width, margin: "0 auto" }}>
            <Player
              component={DynamicComposition}
              inputProps={{ payload: videoPayload }}
              durationInFrames={payload.durationInFrames}
              compositionWidth={payload.width}
              compositionHeight={payload.height}
              fps={payload.fps}
              style={{
                width: "100%",
                aspectRatio: `${payload.width} / ${payload.height}`,
              }}
              controls
            />
          </div>
        );
      }

      throw new Error(`Unsupported payload kind/mode: ${(payload as any).kind}/${(payload as any).mode}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      sendError(message, false);
      return null;
    }
  };

  return (
    <div ref={containerRef} style={{ padding: "1rem", minHeight: "100px" }}>
      {error ? (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#c00", marginBottom: "0.5rem" }}>Renderer Error</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.875rem" }}>
            {error}
          </pre>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}
