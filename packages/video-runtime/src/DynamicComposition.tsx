'use client';

import React from "react";
import { AbsoluteFill } from "remotion";
import type { RenderPayload } from "@repo/runtime-protocol";
import { validateVideoSpec } from "./remotion-spec/validate";
import { renderVideoNode } from "./remotion-spec/render-node";
import { compileVideoCode } from "./remotion-code/compile";
import { executeVideoCode } from "./remotion-code/execute";

export type DynamicCompositionProps = {
  payload: Extract<RenderPayload, { kind: "video" }> | null;
};

export const DynamicComposition: React.FC<DynamicCompositionProps> = ({
  payload,
}) => {
  if (!payload) {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: 32,
          background:
            "linear-gradient(135deg, #0b1221 0%, #0f1b33 60%, #0b1221 100%)",
        }}
      >
        Awaiting payload…
      </AbsoluteFill>
    );
  }

  if (payload.mode === "spec") {
    const validated = validateVideoSpec(payload.spec);
    return renderVideoNode(validated);
  }

  const compiled = compileVideoCode(payload.code);
  const Component = executeVideoCode(
    compiled,
  ) as React.ComponentType<{ payload?: typeof payload }>;
  return <Component payload={payload} />;
};
