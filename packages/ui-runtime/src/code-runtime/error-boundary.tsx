'use client';

import React from "react";

type Props = {
  onError?: (error: Error) => void;
  children: React.ReactNode;
};

type State = { hasError: boolean; message?: string };

export class UiRuntimeErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            background: "rgba(255,0,0,0.05)",
            color: "#ff7b7b",
          }}
        >
          <strong>Runtime error:</strong> {this.state.message}
        </div>
      );
    }

    return this.props.children;
  }
}
