import type React from "react";
import { createDependencyScope, resolveDependency } from "./dependency-scope";

export function executeUiCode(compiledCode: string): React.ComponentType {
  const scope = createDependencyScope();
  const exports: Record<string, unknown> = {};
  const module = { exports };

  const require = (name: string) => resolveDependency(name, scope);

  const fn = new Function("exports", "module", "require", "React", compiledCode);
  fn(exports, module, require, scope.react);

  const Component =
    (module.exports as Record<string, unknown>).default ??
    (exports as Record<string, unknown>).default;

  if (!Component) {
    throw new Error("Code runtime must export a default React component.");
  }

  return Component as React.ComponentType;
}
