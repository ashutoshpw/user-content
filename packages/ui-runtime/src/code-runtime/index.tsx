import React from "react";
// @ts-ignore - Babel standalone doesn't have types
import * as Babel from "@babel/standalone";
import { uiRegistry } from "../registry";

const MAX_CODE_SIZE = 50000; // 50KB

export class CodeRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CodeRuntimeError";
  }
}

export interface CodeRuntimeProps {
  code: string;
}

export const CodeRuntime: React.FC<CodeRuntimeProps> = ({ code }) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      if (code.length > MAX_CODE_SIZE) {
        throw new CodeRuntimeError(`Code size exceeds maximum of ${MAX_CODE_SIZE} bytes`);
      }

      const compiledCode = Babel.transform(code, {
        presets: ["react", "typescript"],
        filename: "component.tsx",
      }).code;

      if (!compiledCode) {
        throw new CodeRuntimeError("Failed to compile code");
      }

      const allowedGlobals = {
        React,
        ...uiRegistry,
      };

      const fn = new Function(...Object.keys(allowedGlobals), `return (${compiledCode})`);
      const component = fn(...Object.values(allowedGlobals));

      if (typeof component === "function") {
        setComponent(() => component);
        setError(null);
      } else if (component?.default && typeof component.default === "function") {
        setComponent(() => component.default);
        setError(null);
      } else {
        throw new CodeRuntimeError("Code must export a React component");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setComponent(null);
    }
  }, [code]);

  if (error) {
    return (
      <div style={{ padding: "1rem", backgroundColor: "#fee", border: "1px solid #fcc" }}>
        <h3>Runtime Error</h3>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error}</pre>
      </div>
    );
  }

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "1rem", backgroundColor: "#fee", border: "1px solid #fcc" }}>
          <h3>Component Error</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
