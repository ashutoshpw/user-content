import { z } from "zod";

export const uiNodeTypes = [
  "Page",
  "Stack",
  "Row",
  "Grid",
  "Card",
  "Text",
  "Button",
  "Badge",
  "Divider",
  "Image",
  "Table",
  "BarChart",
  "LineChart",
  "AreaChart",
  "Metric",
  "Tabs",
] as const;

export type UiNodeType = (typeof uiNodeTypes)[number];

export type UiNode = {
  type: UiNodeType;
  props?: Record<string, unknown>;
  children?: UiNode[];
};

export const uiNodeSchema: z.ZodType<UiNode> = z.lazy(() =>
  z.object({
    type: z.enum(uiNodeTypes),
    props: z.record(z.any()).optional(),
    children: z.array(uiNodeSchema).optional(),
  }),
);

export const uiSpecSchema = uiNodeSchema;
