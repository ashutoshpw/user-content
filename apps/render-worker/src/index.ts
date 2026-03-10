import http from "http";
import { URL } from "url";
import { RenderJob } from "@repo/runtime-protocol";
import { attemptRender } from "./render.js";

const port = Number(process.env.PORT ?? 4002);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/render") {
    try {
      const body = await readJson(req);
      const job = validateJob(body);
      const result = await attemptRender(job);

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Unknown error processing job",
        }),
      );
    }
    return;
  }

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "render-worker" }));
});

server.listen(port, () => {
  console.log(`[render-worker] listening on :${port}`);
});

function readJson(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = [];
    req
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => {
        try {
          const raw = Buffer.concat(chunks).toString("utf-8");
          resolve(raw ? JSON.parse(raw) : {});
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}

function validateJob(payload: unknown): RenderJob {
  if (!payload || typeof payload !== "object") {
    throw new Error("Render job body must be an object");
  }

  const job = payload as RenderJob;
  if (!job.jobId) {
    throw new Error("jobId is required");
  }
  if (!job.payload) {
    throw new Error("payload is required");
  }
  return job;
}
