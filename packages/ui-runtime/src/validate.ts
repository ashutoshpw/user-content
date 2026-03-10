import { z } from "zod";
import { uiNodeSchema, uiNodeTypes, type UiNode } from "./schema";

const chartKeys = new Set(["BarChart", "LineChart", "AreaChart"]);

export function validateUiSpec(spec: unknown): UiNode {
  const parsed = uiNodeSchema.parse(spec);
  walk(parsed);
  return parsed;
}

function walk(node: UiNode, path = "root"): void {
  if (!uiNodeTypes.includes(node.type)) {
    throw new Error(`Unknown node type at ${path}: ${node.type as string}`);
  }

  if (chartKeys.has(node.type)) {
    validateChartProps(node.props, path);
  }

  if (node.type === "Table") {
    validateTableProps(node.props, path);
  }

  if (node.type === "Tabs") {
    validateTabs(node.props, path);
  }

  node.children?.forEach((child, idx) => walk(child, `${path}.children[${idx}]`));
}

function validateChartProps(
  props: UiNode["props"],
  path: string,
): asserts props is Record<string, unknown> {
  if (!props) throw new Error(`Missing props for chart at ${path}`);
  const schema = z.object({
    data: z.array(z.record(z.union([z.string(), z.number()]))),
    xKey: z.string(),
    yKeys: z.array(z.string()).nonempty(),
    stacked: z.boolean().optional(),
    title: z.string().optional(),
  });
  schema.parse(props);
}

function validateTableProps(
  props: UiNode["props"],
  path: string,
): asserts props is Record<string, unknown> {
  if (!props) throw new Error(`Missing props for table at ${path}`);
  const schema = z.object({
    columns: z
      .array(z.object({ key: z.string(), label: z.string() }))
      .nonempty(),
    rows: z.array(z.record(z.union([z.string(), z.number()]))),
  });
  schema.parse(props);
}

function validateTabs(props: UiNode["props"], path: string) {
  if (!props) throw new Error(`Missing props for tabs at ${path}`);
  const schema = z.object({
    tabs: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z.string(),
          content: z.any().optional(),
          children: z.array(uiNodeSchema).optional(),
        }),
      )
      .nonempty(),
  });
  schema.parse(props);
}
