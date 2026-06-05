import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = root;
const dataPath = join(root, "data", "profile.json");
const port = Number(process.env.PORT || 8017);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime"
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

async function serveStatic(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const route = url.pathname === "/" ? "/index.html" : url.pathname;
  const candidate = normalize(join(publicDir, route));

  if (!candidate.startsWith(publicDir)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const file = await readFile(candidate);
    send(res, 200, file, mimeTypes[extname(candidate)] || "application/octet-stream");
  } catch {
    send(res, 404, "Not found");
  }
}

const server = createServer(async (req, res) => {
  if (req.url?.startsWith("/api/profile")) {
    try {
      const profile = await readFile(dataPath, "utf-8");
      send(res, 200, profile, "application/json; charset=utf-8");
    } catch {
      send(res, 500, JSON.stringify({ error: "Unable to load profile data" }), "application/json; charset=utf-8");
    }
    return;
  }

  await serveStatic(req, res);
});

server.listen(port, "::", () => {
  console.log(`Thao Nguyen Bui portfolio running at http://[::1]:${port}`);
});
