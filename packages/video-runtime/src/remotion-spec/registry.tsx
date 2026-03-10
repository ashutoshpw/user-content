/* eslint-disable react/prop-types */
import type { ReactNode } from "react";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Text as DsText } from "@repo/design-system";
import type { VideoNodeType } from "./schema";

type VideoRenderer = (
  props: Record<string, unknown>,
  children: ReactNode[],
) => ReactNode;

export const videoRegistry: Record<VideoNodeType, VideoRenderer> = {
  AbsoluteFill: (props, children) => (
    <AbsoluteFill
      style={{
        backgroundColor: stringProp(props.backgroundColor) ?? "#0b1221",
        justifyContent: "center",
        alignItems: "center",
        padding: numberProp(props.padding, 40),
        color: "white",
      }}
    >
      {children}
    </AbsoluteFill>
  ),
  Sequence: (props, children) => (
    <Sequence
      from={numberProp(props.from, 0) ?? 0}
      durationInFrames={numberProp(props.durationInFrames)}
      name={stringProp(props.name)}
    >
      {children}
    </Sequence>
  ),
  Text: (props) => (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: numberProp(props.size, 64),
        color: stringProp(props.color) ?? "white",
        fontWeight: stringProp(props.weight) ?? "800",
        textAlign: "center",
        padding: 40,
      }}
    >
      {stringProp(props.text) ?? ""}
    </AbsoluteFill>
  ),
  Image: (props) => (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={stringProp(props.src) ?? ""}
        style={{
          width: stringOrNumber(props.width) ?? "100%",
          height: stringOrNumber(props.height) ?? "100%",
          objectFit: fitProp(props.fit) ?? "cover",
          borderRadius: numberProp(props.radius, 4),
        }}
      />
    </AbsoluteFill>
  ),
  Audio: (props) => <Audio src={stringProp(props.src) ?? ""} />,
  Video: (props, children) => (
    <AbsoluteFill>
      <Video
        src={stringProp(props.src) ?? ""}
        startFrom={numberProp(props.startFrom, 0) ?? 0}
        endAt={numberProp(props.endAt)}
        style={{ objectFit: fitProp(props.fit) ?? "cover" }}
      />
      {children}
    </AbsoluteFill>
  ),
  FadeIn: (props, children) => (
    <FadeInBlock durationInFrames={numberProp(props.durationInFrames, 20) ?? 20}>
      {children}
    </FadeInBlock>
  ),
  SlideUp: (props, children) => (
    <SlideUpBlock
      durationInFrames={numberProp(props.durationInFrames, 25) ?? 25}
      offset={numberProp(props.offset, 60) ?? 60}
    >
      {children}
    </SlideUpBlock>
  ),
  AnimatedNumber: (props) => (
    <AnimatedNumberBlock
      from={numberProp(props.from, 0) ?? 0}
      to={numberProp(props.to, 100) ?? 100}
      durationInFrames={numberProp(props.durationInFrames, 45) ?? 45}
      prefix={stringProp(props.prefix)}
      suffix={stringProp(props.suffix)}
    />
  ),
  ChartBarScene: (props) => (
    <ChartBarScene
      title={stringProp(props.title)}
      data={(props.data as Array<Record<string, number | string>>) ?? []}
      xKey={stringProp(props.xKey) ?? "label"}
      yKeys={(props.yKeys as string[]) ?? []}
    />
  ),
  MetricScene: (props) => (
    <MetricScene
      label={stringProp(props.label) ?? "Metric"}
      value={stringProp(props.value) ?? ""}
      delta={numberProp(props.delta)}
      caption={stringProp(props.caption)}
    />
  ),
  TitleScene: (props, children) => (
    <TitleScene
      title={stringProp(props.title) ?? "Dynamic Composition"}
      subtitle={stringProp(props.subtitle)}
    >
      {children}
    </TitleScene>
  ),
};

const FadeInBlock: React.FC<{
  durationInFrames: number;
  children: ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center" }}>
      {children}
    </AbsoluteFill>
  );
};

const SlideUpBlock: React.FC<{
  durationInFrames: number;
  offset: number;
  children: ReactNode;
}> = ({ durationInFrames, offset, children }) => {
  const frame = useCurrentFrame();
  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    [offset, 0],
    { extrapolateRight: "clamp" },
  );
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const AnimatedNumberBlock: React.FC<{
  from: number;
  to: number;
  durationInFrames: number;
  prefix?: string;
  suffix?: string;
}> = ({ from, to, durationInFrames, prefix, suffix }) => {
  const frame = useCurrentFrame();
  const progress = spring({
    frame,
    fps: useVideoConfig().fps,
    config: { damping: 12 },
    durationInFrames,
  });

  const value = Math.round(interpolate(progress, [0, 1], [from, to]));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontSize: 96,
        fontWeight: 800,
        color: "white",
      }}
    >
      {prefix ?? ""}
      {value.toLocaleString()}
      {suffix ?? ""}
    </AbsoluteFill>
  );
};

const ChartBarScene: React.FC<{
  title?: string;
  data: Array<Record<string, number | string>>;
  xKey: string;
  yKeys: string[];
}> = ({ title, data, xKey, yKeys }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const colors = ["#5df1c8", "#9b8bff", "#f6c344", "#78a6ff"];

  return (
    <AbsoluteFill
      style={{
        padding: 48,
        justifyContent: "center",
        alignItems: "stretch",
        opacity,
      }}
    >
      <Card
        title={title ?? "Performance"}
        subtitle="Generated Remotion scene"
      >
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              {yKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="stack"
                  fill={colors[idx % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const MetricScene: React.FC<{
  label: string;
  value: string;
  delta?: number;
  caption?: string;
}> = ({ label, value, delta, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 90 },
  });

  const translateY = interpolate(progress, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        gap: 12,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <DsText value={label} variant="subtitle" muted align="center" />
      <DsText value={value} variant="display" align="center" />
      {typeof delta === "number" ? (
        <DsText
          value={`${delta > 0 ? "+" : ""}${delta.toFixed(1)}% vs last period`}
          variant="body"
          align="center"
          muted
        />
      ) : null}
      {caption ? <DsText value={caption} variant="caption" align="center" /> : null}
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{
  title: string;
  subtitle?: string;
  children?: ReactNode;
}> = ({ title, subtitle, children }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const subtitleOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
        padding: 48,
        color: "white",
        background:
          "radial-gradient(circle at 20% 20%, rgba(93,241,200,0.12), transparent 35%), radial-gradient(circle at 80% 30%, rgba(155,139,255,0.18), transparent 30%), #0b1221",
      }}
    >
      <div style={{ opacity: titleOpacity }}>
        <DsText value={title} variant="display" align="center" />
      </div>
      {subtitle ? (
        <div style={{ opacity: subtitleOpacity }}>
          <DsText value={subtitle} variant="subtitle" align="center" muted />
        </div>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

function stringProp(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberProp(value: unknown, fallback?: number): number | undefined {
  if (typeof value === "number") return value;
  return fallback;
}

function stringOrNumber(value: unknown): string | number | undefined {
  if (typeof value === "string" || typeof value === "number") return value;
  return undefined;
}

type ObjectFitValue = "fill" | "contain" | "cover" | "none" | "scale-down";

function fitProp(value: unknown): ObjectFitValue | undefined {
  const allowed: ObjectFitValue[] = [
    "fill",
    "contain",
    "cover",
    "none",
    "scale-down",
  ];
  return typeof value === "string" && (allowed as string[]).includes(value)
    ? (value as ObjectFitValue)
    : undefined;
}
