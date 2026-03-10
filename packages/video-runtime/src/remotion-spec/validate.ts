import { z } from "zod";
import { videoNodeSchema, videoNodeTypes, type VideoNode } from "./schema";

export function validateVideoSpec(spec: unknown): VideoNode {
  const parsed = videoNodeSchema.parse(spec);
  walk(parsed);
  return parsed;
}

function walk(node: VideoNode, path = "root"): void {
  if (!videoNodeTypes.includes(node.type)) {
    throw new Error(`Unknown video node "${node.type as string}" at ${path}`);
  }

  if (node.type === "Sequence") {
    const schema = z.object({
      from: z.number().optional(),
      durationInFrames: z.number().optional(),
      name: z.string().optional(),
    });
    schema.parse(node.props ?? {});
  }

  if (node.type === "AnimatedNumber") {
    const schema = z.object({
      from: z.number().optional(),
      to: z.number(),
      durationInFrames: z.number().optional(),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
    });
    schema.parse(node.props ?? {});
  }

  if (node.type === "ChartBarScene") {
    const schema = z.object({
      title: z.string().optional(),
      data: z.array(z.record(z.union([z.string(), z.number()]))),
      xKey: z.string(),
      yKeys: z.array(z.string()).nonempty(),
    });
    schema.parse(node.props ?? {});
  }

  node.children?.forEach((child, idx) => walk(child, `${path}.children[${idx}]`));
}
