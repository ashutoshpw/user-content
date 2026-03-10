import * as React from "react";
import * as DesignSystem from "@repo/design-system";
import * as Recharts from "recharts";

type Scope = Record<string, unknown>;

export function createDependencyScope(): Scope {
  return {
    react: React,
    "@repo/design-system": DesignSystem,
    recharts: Recharts,
  };
}

export function resolveDependency(name: string, scope: Scope) {
  const dep = scope[name];
  if (!dep) {
    throw new Error(`Dependency "${name}" is not allowed in code runtime.`);
  }
  return dep;
}
