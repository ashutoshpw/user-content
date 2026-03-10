import type { ReactNode } from "react";
import { videoRegistry } from "./registry";
import type { VideoNode } from "./schema";

export function renderVideoNode(node: VideoNode, keyPrefix = "video"): ReactNode {
  const renderer = videoRegistry[node.type];
  if (!renderer) {
    throw new Error(`Missing renderer for video node ${node.type}`);
  }

  const children = node.children?.map((child, idx) =>
    renderVideoNode(child, `${keyPrefix}.${node.type}[${idx}]`),
  );

  return renderer(node.props ?? {}, children ?? []);
}
