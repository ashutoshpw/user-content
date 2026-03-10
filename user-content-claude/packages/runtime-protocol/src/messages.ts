export type RendererReadyMessage = {
  type: "renderer:ready";
  version: 1;
  supportedKinds: Array<"ui" | "video">;
};

export type RendererResizeMessage = {
  type: "renderer:resize";
  version: 1;
  height: number;
};

export type RendererErrorMessage = {
  type: "renderer:error";
  version: 1;
  message: string;
  recoverable?: boolean;
};

export type RenderPayload =
  | {
      kind: "ui";
      mode: "spec";
      spec: unknown;
      metadata?: Record<string, unknown>;
    }
  | {
      kind: "ui";
      mode: "code";
      code: string;
      metadata?: Record<string, unknown>;
    }
  | {
      kind: "video";
      mode: "spec";
      fps: number;
      durationInFrames: number;
      width: number;
      height: number;
      spec: unknown;
      metadata?: Record<string, unknown>;
    }
  | {
      kind: "video";
      mode: "code";
      fps: number;
      durationInFrames: number;
      width: number;
      height: number;
      code: string;
      metadata?: Record<string, unknown>;
    };

export type RendererLoadMessage = {
  type: "renderer:load";
  version: 1;
  payload: RenderPayload;
};

export type ParentToRendererMessage = RendererLoadMessage;

export type RendererToParentMessage =
  | RendererReadyMessage
  | RendererResizeMessage
  | RendererErrorMessage;
