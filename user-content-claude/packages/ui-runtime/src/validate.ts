import { UiNode } from "./schema";
import { ComponentName, uiRegistry } from "./registry";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateNode(node: unknown): UiNode {
  if (!node || typeof node !== "object") {
    throw new ValidationError("Node must be an object");
  }

  const n = node as Record<string, unknown>;

  if (typeof n.type !== "string") {
    throw new ValidationError("Node must have a type string");
  }

  if (!(n.type in uiRegistry)) {
    throw new ValidationError(`Unknown component type: ${n.type}`);
  }

  const validated: UiNode = {
    type: n.type,
  };

  if (n.props !== undefined) {
    if (typeof n.props !== "object" || n.props === null) {
      throw new ValidationError("Props must be an object");
    }
    validated.props = n.props as Record<string, unknown>;
  }

  if (n.children !== undefined) {
    if (!Array.isArray(n.children)) {
      throw new ValidationError("Children must be an array");
    }
    validated.children = n.children.map((child) => validateNode(child));
  }

  return validated;
}

export function validateSpec(spec: unknown): UiNode {
  return validateNode(spec);
}
