'use client';

import Link from "next/link";
import { Badge, Card, Page, Stack, Text } from "@repo/design-system";

export default function RendererHome() {
  return (
    <Page
      title="Renderer shell"
      description="A stable iframe host that accepts renderer:load payloads. Load /embed inside the parent app."
      headerExtra={<Badge label="/embed route live" tone="success" />}
    >
      <Stack gap={16}>
        <Card
          title="How it works"
          subtitle="The renderer listens for renderer:load messages from the parent window and dispatches ui or video runtimes."
        >
          <Stack gap={10}>
            <Text value="• /embed sends renderer:ready with supported kinds." />
            <Text value="• Parent replies with renderer:load containing ui-spec, ui-code, video-spec, or video-code payloads." />
            <Text value="• Runtime emits renderer:resize and renderer:error as the view changes." />
          </Stack>
        </Card>
        <Card title="Open the runtime">
          <Link href="/embed" style={{ color: "var(--ds-text)" }}>
            Go to /embed →
          </Link>
        </Card>
      </Stack>
    </Page>
  );
}
