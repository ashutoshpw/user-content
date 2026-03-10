import fs from "fs";
import path from "path";
import type { RenderJob } from "@repo/runtime-protocol";

type RenderResult =
  | {
      jobId: string;
      status: "queued";
      message: string;
      payloadEcho: RenderJob["payload"];
    }
  | {
      jobId: string;
      status: "completed";
      outputUrl: string;
    }
  | {
      jobId: string;
      status: "failed";
      error: string;
    };

export async function attemptRender(job: RenderJob): Promise<RenderResult> {
  if (process.env.ENABLE_REMOTION_RENDER !== "true") {
    return {
      jobId: job.jobId,
      status: "queued",
      message:
        "Remotion rendering is disabled (set ENABLE_REMOTION_RENDER=true to enable).",
      payloadEcho: job.payload,
    };
  }

  try {
    const result = await renderRemotion(job);
    return result;
  } catch (error) {
    return {
      jobId: job.jobId,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown render failure",
    };
  }
}

async function renderRemotion(job: RenderJob): Promise<RenderResult> {
  const outputDir = path.join(process.cwd(), "renders");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputLocation = path.join(outputDir, `${job.jobId}.json`);
  fs.writeFileSync(
    outputLocation,
    JSON.stringify(
      {
        note:
          "Server-side Remotion render stub. Swap this with @remotion/renderer renderMedia for full exports.",
        job,
      },
      null,
      2,
    ),
    "utf-8",
  );

  return {
    jobId: job.jobId,
    status: "completed",
    outputUrl: outputLocation,
  };
}
