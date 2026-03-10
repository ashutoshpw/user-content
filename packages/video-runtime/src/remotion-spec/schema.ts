import { z } from "zod";

export const videoNodeTypes = [
  "AbsoluteFill",
  "Sequence",
  "Text",
  "Image",
  "Audio",
  "Video",
  "ChartBarScene",
  "MetricScene",
  "TitleScene",
  "FadeIn",
  "SlideUp",
  "AnimatedNumber",
] as const;

export type VideoNodeType = (typeof videoNodeTypes)[number];

export type VideoNode = {
  type: VideoNodeType;
  props?: Record<string, unknown>;
  children?: VideoNode[];
};

export const videoNodeSchema: z.ZodType<VideoNode> = z.lazy(() =>
  z.object({
    type: z.enum(videoNodeTypes),
    props: z.record(z.any()).optional(),
    children: z.array(videoNodeSchema).optional(),
  }),
);

export const videoSpecSchema = videoNodeSchema;
