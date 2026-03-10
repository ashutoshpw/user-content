import express from "express";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { bundle } from "@remotion/bundler";
import path from "path";
import fs from "fs";
import { RenderPayload } from "@user-content/runtime-protocol";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json({ limit: "10mb" }));

interface RenderJob {
  jobId: string;
  payload: Extract<RenderPayload, { kind: "video" }>;
  output: {
    format: "mp4" | "webm" | "png-sequence";
  };
}

interface RenderJobResponse {
  jobId: string;
  status: "queued" | "rendering" | "completed" | "failed";
  outputUrl?: string;
  error?: string;
}

const jobs = new Map<string, RenderJobResponse>();

app.post("/render", async (req, res) => {
  try {
    const job: RenderJob = req.body;

    if (!job.jobId || !job.payload || !job.output) {
      return res.status(400).json({ error: "Invalid job specification" });
    }

    jobs.set(job.jobId, {
      jobId: job.jobId,
      status: "queued",
    });

    res.json({
      jobId: job.jobId,
      status: "queued",
      message: "Job queued for rendering",
    });

    processRenderJob(job).catch((error) => {
      console.error(`Job ${job.jobId} failed:`, error);
      jobs.set(job.jobId, {
        jobId: job.jobId,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    });
  } catch (error) {
    console.error("Error creating render job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
});

async function processRenderJob(job: RenderJob) {
  jobs.set(job.jobId, {
    jobId: job.jobId,
    status: "rendering",
  });

  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "../src/remotion/index.tsx"),
    webpackOverride: (config) => config,
  });

  const compositionId = "dynamic";
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: {
      payload: {
        fps: job.payload.fps,
        durationInFrames: job.payload.durationInFrames,
        width: job.payload.width,
        height: job.payload.height,
        spec: job.payload.mode === "spec" ? job.payload.spec : undefined,
        code: job.payload.mode === "code" ? job.payload.code : undefined,
      },
    },
  });

  const outputDir = path.join(__dirname, "../../output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${job.jobId}.${job.output.format === "png-sequence" ? "png" : job.output.format}`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: job.output.format === "webm" ? "vp8" : "h264",
    outputLocation: outputPath,
    inputProps: {
      payload: {
        fps: job.payload.fps,
        durationInFrames: job.payload.durationInFrames,
        width: job.payload.width,
        height: job.payload.height,
        spec: job.payload.mode === "spec" ? job.payload.spec : undefined,
        code: job.payload.mode === "code" ? job.payload.code : undefined,
      },
    },
  });

  jobs.set(job.jobId, {
    jobId: job.jobId,
    status: "completed",
    outputUrl: `/output/${job.jobId}.${job.output.format}`,
  });
}

app.use("/output", express.static(path.join(__dirname, "../../output")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Render worker listening on port ${PORT}`);
});
