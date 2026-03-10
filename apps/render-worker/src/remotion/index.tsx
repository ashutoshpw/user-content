import React from "react";
import { Composition } from "remotion";
import { DynamicComposition, VideoPayload } from "@user-content/video-runtime";

const defaultPayload: VideoPayload = {
  fps: 30,
  durationInFrames: 150,
  width: 1280,
  height: 720,
  spec: {
    type: "AbsoluteFill",
    children: [
      {
        type: "TitleScene",
        props: {
          title: "Server-side Render",
          subtitle: "Dynamic Video Generation",
        },
      },
    ],
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="dynamic"
        component={DynamicComposition}
        fps={30}
        width={1280}
        height={720}
        durationInFrames={300}
        defaultProps={{ payload: defaultPayload }}
      />
    </>
  );
};
