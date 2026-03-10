import React from "react";
import { validateSpec } from "./remotion-spec/validate";
import { RenderNode } from "./remotion-spec/render-node";
import { VideoPayload } from "./remotion-spec/schema";
// @ts-ignore - Babel standalone doesn't have types
import * as Babel from "@babel/standalone";
import { remotionRegistry } from "./remotion-spec/registry";
import { AbsoluteFill } from "remotion";

export interface DynamicCompositionProps {
  payload?: VideoPayload | null;
}

export const DynamicComposition: React.FC<DynamicCompositionProps> = ({ payload = null }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [CodeComponent, setCodeComponent] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    if (!payload) {
      setError(null);
      setCodeComponent(null);
      return;
    }

    if (payload.code) {
      try {
        const compiledCode = Babel.transform(payload.code, {
          presets: ["react", "typescript"],
          plugins: ["transform-modules-commonjs"],
          filename: "component.tsx",
        }).code;

        if (!compiledCode) {
          throw new Error("Failed to compile code");
        }

        const allowedGlobals = {
          React,
          ...remotionRegistry,
        };

        const wrapper = `
          const exports = {};
          const module = { exports };
          ${compiledCode}
          return exports.default || module.exports?.default || module.exports || exports;
        `;
        const fn = new Function(...Object.keys(allowedGlobals), wrapper);
        const component = fn(...Object.values(allowedGlobals));

        if (typeof component === "function") {
          setCodeComponent(() => component);
          setError(null);
        } else if (component?.default && typeof component.default === "function") {
          setCodeComponent(() => component.default);
          setError(null);
        } else {
          throw new Error("Code must export a React component");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setCodeComponent(null);
      }
    } else {
      setCodeComponent(null);
      setError(null);
    }
  }, [payload?.code]);

  if (!payload) {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div style={{ fontSize: 24, color: "#666" }}>No payload provided</div>
      </AbsoluteFill>
    );
  }

  if (error) {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fee",
          padding: 40,
        }}
      >
        <div style={{ fontSize: 24, color: "#c00" }}>Runtime Error</div>
        <pre style={{ fontSize: 14, marginTop: 20, maxWidth: "80%" }}>{error}</pre>
      </AbsoluteFill>
    );
  }

  if (payload.code && CodeComponent) {
    return <CodeComponent />;
  }

  if (payload.spec) {
    try {
      const validatedSpec = validateSpec(payload.spec);
      return <RenderNode node={validatedSpec} />;
    } catch (err) {
      return (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fee",
            padding: 40,
          }}
        >
          <div style={{ fontSize: 24, color: "#c00" }}>Validation Error</div>
          <pre style={{ fontSize: 14, marginTop: 20, maxWidth: "80%" }}>
            {err instanceof Error ? err.message : String(err)}
          </pre>
        </AbsoluteFill>
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div style={{ fontSize: 24, color: "#666" }}>No spec or code provided</div>
    </AbsoluteFill>
  );
};
