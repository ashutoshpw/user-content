"use client";

import React from "react";
import {
  RendererToParentMessage,
  ParentToRendererMessage,
  RenderPayload,
} from "@user-content/runtime-protocol";

interface IframeRendererProps {
  rendererUrl: string;
  payload: RenderPayload | null;
  onReady?: () => void;
  onResize?: (height: number) => void;
  onError?: (message: string, recoverable?: boolean) => void;
}

export const IframeRenderer: React.FC<IframeRendererProps> = ({
  rendererUrl,
  payload,
  onReady,
  onResize,
  onError,
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [height, setHeight] = React.useState(600);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(rendererUrl).origin) {
        return;
      }

      const message = event.data as RendererToParentMessage;

      switch (message.type) {
        case "renderer:ready":
          setIsReady(true);
          onReady?.();
          break;

        case "renderer:resize":
          setHeight(message.height);
          onResize?.(message.height);
          break;

        case "renderer:error":
          onError?.(message.message, message.recoverable);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [rendererUrl, onReady, onResize, onError]);

  React.useEffect(() => {
    if (!isReady || !payload || !iframeRef.current?.contentWindow) {
      return;
    }

    const message: ParentToRendererMessage = {
      type: "renderer:load",
      version: 1,
      payload,
    };

    iframeRef.current.contentWindow.postMessage(message, new URL(rendererUrl).origin);
  }, [isReady, payload, rendererUrl]);

  return (
    <iframe
      ref={iframeRef}
      src={rendererUrl}
      style={{
        width: "100%",
        height: `${height}px`,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
      title="Renderer"
    />
  );
};
