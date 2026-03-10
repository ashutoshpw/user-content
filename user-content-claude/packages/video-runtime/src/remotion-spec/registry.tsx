import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  Video,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface TextProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({ children, style }) => {
  return <div style={{ fontSize: 48, fontWeight: "bold", ...style }}>{children}</div>;
};

export interface ImageProps {
  src: string;
  style?: React.CSSProperties;
}

export const Image: React.FC<ImageProps> = ({ src, style }) => {
  return <Img src={src} style={{ maxWidth: "100%", maxHeight: "100%", ...style }} />;
};

export interface FadeInProps {
  children?: React.ReactNode;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, duration = 30 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity }}>{children}</div>;
};

export interface SlideUpProps {
  children?: React.ReactNode;
  duration?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({ children, duration = 30 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const translateY = interpolate(frame, [0, duration], [height / 4, 0], {
    extrapolateRight: "clamp",
  });

  return <div style={{ transform: `translateY(${translateY}px)` }}>{children}</div>;
};

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const animatedValue = interpolate(frame, [0, duration], [0, value], {
    extrapolateRight: "clamp",
  });

  return <div style={style}>{Math.round(animatedValue)}</div>;
};

export interface TitleSceneProps {
  title: string;
  subtitle?: string;
}

export const TitleScene: React.FC<TitleSceneProps> = ({ title, subtitle }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#007bff",
        color: "white",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <FadeIn duration={20}>
        <Text style={{ fontSize: 72 }}>{title}</Text>
      </FadeIn>
      {subtitle && (
        <FadeIn duration={20}>
          <Text style={{ fontSize: 36, fontWeight: "normal" }}>{subtitle}</Text>
        </FadeIn>
      )}
    </AbsoluteFill>
  );
};

export interface MetricSceneProps {
  value: number;
  label: string;
  change?: string;
}

export const MetricScene: React.FC<MetricSceneProps> = ({ value, label, change }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <AnimatedNumber value={value} duration={60} style={{ fontSize: 96, fontWeight: "bold" }} />
      <Text style={{ fontSize: 32, color: "#666" }}>{label}</Text>
      {change && <Text style={{ fontSize: 24, color: "#28a745" }}>{change}</Text>}
    </AbsoluteFill>
  );
};

export interface ChartBarSceneProps {
  title: string;
  data?: Array<{ name: string; value: number }>;
}

export const ChartBarScene: React.FC<ChartBarSceneProps> = ({ title, data = [] }) => {
  const frame = useCurrentFrame();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 60,
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        <Text style={{ fontSize: 48, marginBottom: 40 }}>{title}</Text>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end", height: 400 }}>
          {data.map((item, index) => {
            const delay = index * 10;
            const height = interpolate(frame, [delay, delay + 30], [0, (item.value / maxValue) * 100], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${height}%`,
                    backgroundColor: "#007bff",
                    borderRadius: 4,
                  }}
                />
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: "#666" }}>{item.value}</Text>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const remotionRegistry: Record<string, React.ComponentType<any>> = {
  AbsoluteFill,
  Sequence,
  Text,
  Image,
  Audio,
  Video,
  ChartBarScene,
  MetricScene,
  TitleScene,
  FadeIn,
  SlideUp,
  AnimatedNumber,
};

export type RemotionRegistryType = typeof remotionRegistry;
export type RemotionComponentName = keyof RemotionRegistryType;
