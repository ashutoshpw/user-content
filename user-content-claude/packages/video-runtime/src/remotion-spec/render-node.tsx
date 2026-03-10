import React from "react";
import { VideoNode } from "./schema";
import { remotionRegistry, RemotionComponentName } from "./registry";

export interface RenderNodeProps {
  node: VideoNode;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ node }) => {
  const Component = remotionRegistry[node.type as RemotionComponentName];

  if (!Component) {
    console.error(`Unknown component type: ${node.type}`);
    return null;
  }

  const children = node.children?.map((child, index) => (
    <RenderNode key={index} node={child} />
  ));

  return React.createElement(Component as React.ComponentType<any>, node.props || {}, children);
};
