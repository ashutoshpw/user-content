export type VideoNode = {
  type: string;
  props?: Record<string, unknown>;
  children?: VideoNode[];
};

export type VideoSpec = VideoNode;

export type VideoPayload = {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  spec?: VideoSpec;
  code?: string;
};
