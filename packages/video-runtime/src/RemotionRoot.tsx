import React from "react";
import { Composition } from "remotion";
import { DynamicComposition } from "./DynamicComposition";

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
        defaultProps={{ payload: null }}
      />
    </>
  );
};
