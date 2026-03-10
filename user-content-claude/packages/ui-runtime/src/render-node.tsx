import React from "react";
import { UiNode } from "./schema";
import { uiRegistry, ComponentName } from "./registry";

export interface RenderNodeProps {
  node: UiNode;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ node }) => {
  const Component = uiRegistry[node.type as ComponentName];

  if (!Component) {
    console.error(`Unknown component type: ${node.type}`);
    return null;
  }

  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ));

  return React.createElement(Component as React.ComponentType<any>, node.props || {}, children);
};
