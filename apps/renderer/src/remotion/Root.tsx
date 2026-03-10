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
          title: "Default Composition",
          subtitle: "Edit the payload to see changes",
        },
      },
    ],
  },
};

export const RemotionRoot = () => {
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
