'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@remotion/player";
import {
  Badge,
  Card,
  Page,
  Stack,
  Text,
} from "@repo/design-system";
import type {
  RenderPayload,
  RendererLoadMessage,
  RendererToParentMessage,
} from "@repo/runtime-protocol";
import {
  UiRuntimeErrorBoundary,
  renderNode,
  validateUiSpec,
  compileUiCode,
  executeUiCode,
} from "@repo/ui-runtime";
import { DynamicComposition } from "@repo/video-runtime";

const allowedParents =
  process.env.NEXT_PUBLIC_ALLOWED_PARENTS?.split(",").map((item) => item.trim()) ??
  [];

export default function EmbedRuntime() {
  const [payload, setPayload] = useState<RenderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("waiting");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parentOriginRef = useRef<string | null>(null);

  const isOriginAllowed = useMemo(() => {
    if (!allowedParents.length && typeof window !== "undefined") {
      return [window.origin];
    }
    return allowedParents;
  }, []);

  const postToParent = useCallback((message: RendererToParentMessage) => {
    const target = parentOriginRef.current ?? "*";
    window.parent?.postMessage(message, target);
  }, []);

  useEffect(() => {
    postToParent({
      type: "renderer:ready",
      version: 1,
      supportedKinds: ["ui", "video"],
    });
  }, [postToParent]);

  useEffect(() => {
    const handler = (event: MessageEvent<RendererLoadMessage>) => {
      if (isOriginAllowed.length && !isOriginAllowed.includes(event.origin)) {
        return;
      }

      if (!event.data || event.data.type !== "renderer:load") return;
      parentOriginRef.current = event.origin;
      setStatus("loaded");
      setError(null);
      setPayload(event.data.payload);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isOriginAllowed]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const height = containerRef.current?.offsetHeight;
      if (!height) return;
      postToParent({ type: "renderer:resize", version: 1, height });
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [postToParent]);

  const handleRuntimeError = useCallback(
    (message: string) => {
      setError(message);
      postToParent({
        type: "renderer:error",
        version: 1,
        message,
        recoverable: true,
      });
    },
    [postToParent],
  );

  const content = useMemo(() => {
    if (!payload) {
      return (
        <Card title="Awaiting payload">
          <Text value="Send renderer:load from the parent to render content." />
        </Card>
      );
    }

    if (payload.kind === "ui") {
      try {
        const spec = payload.mode === "spec" ? validateUiSpec(payload.spec) : null;
        if (payload.mode === "code") {
          const compiled = compileUiCode(payload.code);
          const Component = executeUiCode(compiled);
          return (
            <UiRuntimeErrorBoundary
              onError={(err) => handleRuntimeError(err.message)}
            >
              <Component />
            </UiRuntimeErrorBoundary>
          );
        }

        return (
          <UiRuntimeErrorBoundary
            onError={(err) => handleRuntimeError(err.message)}
          >
            {renderNode(spec!)}
          </UiRuntimeErrorBoundary>
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to render ui runtime";
        handleRuntimeError(message);
        return null;
      }
    }

    if (payload.kind === "video") {
      return (
        <Player
          component={DynamicComposition}
          inputProps={{ payload }}
          compositionWidth={payload.width}
          compositionHeight={payload.height}
          durationInFrames={payload.durationInFrames}
          fps={payload.fps}
          controls
          style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}
        />
      );
    }

    return null;
  }, [payload, handleRuntimeError]);

  return (
    <Page
      title="Renderer runtime"
      description="Stable iframe surface for ui-spec / video-spec payloads."
      headerExtra={<Badge label={`Status: ${status}`} tone="success" />}
    >
      <div ref={containerRef}>
        <Stack gap={12}>
          {error ? (
            <Card title="Runtime error" subtitle="Propagated to parent">
              <Text value={error} />
            </Card>
          ) : null}
          {content}
        </Stack>
      </div>
    </Page>
  );
}
