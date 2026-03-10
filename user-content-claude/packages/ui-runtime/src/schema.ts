export type UiNode = {
  type: string;
  props?: Record<string, unknown>;
  children?: UiNode[];
};

export type UiSpec = UiNode;
