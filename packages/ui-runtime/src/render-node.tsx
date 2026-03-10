import type { ReactNode } from "react";
import { Tabs } from "@repo/design-system";
import { uiRegistry } from "./registry";
import type { UiNode } from "./schema";

export function renderNode(node: UiNode, keyPrefix = "node"): ReactNode {
  if (node.type === "Tabs") {
    const tabs = Array.isArray(node.props?.tabs)
      ? (node.props?.tabs as Array<Record<string, unknown>>)
      : [];

    const renderedTabs = tabs.map((tab, idx) => {
      const id = (tab.id as string) ?? `tab-${idx + 1}`;
      const contentSpec = (tab.content as UiNode | undefined) ??
        (Array.isArray(tab.children) ? (tab.children as UiNode[])[0] : undefined);
      const childrenArray = tab.children as UiNode[] | undefined;

      const content =
        contentSpec !== undefined
          ? renderNode(contentSpec, `${keyPrefix}.tabs[${idx}]`)
          : childrenArray?.map((child, childIdx) =>
              renderNode(child, `${keyPrefix}.tabs[${idx}].children[${childIdx}]`),
            );

      return {
        id,
        label: (tab.label as string) ?? `Tab ${idx + 1}`,
        content,
      };
    });

    return <Tabs tabs={renderedTabs} />;
  }

  const renderer = uiRegistry[node.type];
  if (!renderer) {
    throw new Error(`Renderer missing for node type: ${node.type}`);
  }

  const children = node.children?.map((child, idx) =>
    renderNode(child, `${keyPrefix}.${node.type}[${idx}]`),
  );

  return renderer(node.props ?? {}, children ?? []);
}
