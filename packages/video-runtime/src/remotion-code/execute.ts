import * as React from "react";
import * as Remotion from "remotion";
import * as Recharts from "recharts";
import * as DesignSystem from "@repo/design-system";

type Scope = Record<string, unknown>;

function createScope(): Scope {
  return {
    react: React,
    remotion: Remotion,
    recharts: Recharts,
    "@repo/design-system": DesignSystem,
  };
}

export function executeVideoCode(compiledCode: string): React.ComponentType {
  const scope = createScope();
  const exports: Record<string, unknown> = {};
  const module = { exports };

  const require = (name: string) => {
    const dep = scope[name];
    if (!dep) throw new Error(`Dependency "${name}" is not allowed in video code.`);
    return dep;
  };

  const fn = new Function(
    "exports",
    "module",
    "require",
    "React",
    "Remotion",
    compiledCode,
  );

  fn(exports, module, require, scope.react, scope.remotion);

  const Component =
    (module.exports as Record<string, unknown>).default ??
    (exports as Record<string, unknown>).default;

  if (!Component) {
    throw new Error("Video code runtime must export a default React component.");
  }

  return Component as React.ComponentType;
}
