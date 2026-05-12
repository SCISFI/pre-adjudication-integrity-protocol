import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_PORT = 4175;
const port = Number(process.env.PAIP_SMOKE_PORT ?? DEFAULT_PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(
    `Invalid PAIP_SMOKE_PORT value: ${process.env.PAIP_SMOKE_PORT}`,
  );
}

const baseUrl = `http://127.0.0.1:${port}`;
const startupTimeoutMs = 20_000;
const requestTimeoutMs = 5_000;

const routes = [
  "/",
  "/login",
  "/participant/dashboard",
  "/participant/daily-check-in",
  "/participant/week",
  "/participant/week/1",
  "/participant/week/1/submit",
  "/participant/history",
  "/clinician/dashboard",
  "/clinician/participants/-1",
  "/clinician/participants/-1/summary",
  // Transitional legacy links that should continue to render the SPA shell.
  "/dashboard",
  "/checkin",
  "/modules",
  "/modules/1",
  "/modules/1/submit",
  "/submissions",
  "/clinician",
  "/clinician/1",
];

function findWorkspaceRoot(startDir: string) {
  let current = startDir;

  while (true) {
    if (existsSync(path.join(current, "pnpm-workspace.yaml"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find pnpm-workspace.yaml from ${startDir}`);
    }

    current = parent;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForPreview() {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < startupTimeoutMs) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}/`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await sleep(250);
  }

  throw new Error(
    `Timed out waiting for Vite preview at ${baseUrl}. Last error: ${String(lastError)}`,
  );
}

async function checkRoute(route: string) {
  const response = await fetchWithTimeout(`${baseUrl}${route}`);
  const body = await response.text();
  const hasAppShell = body.includes(
    "<title>Pre-Adjudication Integrity Protocol</title>",
  );

  if (!response.ok || !hasAppShell) {
    throw new Error(
      `Route ${route} failed smoke check: status=${response.status}, appShell=${hasAppShell}`,
    );
  }

  console.log(`✓ ${route} -> ${response.status}`);
}

function stopPreview(preview: ChildProcess) {
  if (!preview.pid || preview.killed) return;

  try {
    process.kill(-preview.pid, "SIGTERM");
  } catch {
    preview.kill("SIGTERM");
  }
}

async function main() {
  const workspaceRoot = findWorkspaceRoot(process.cwd());
  const paipDir = path.resolve(workspaceRoot, "artifacts", "paip");
  const viteBin = path.join(
    paipDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "vite.cmd" : "vite",
  );
  if (!existsSync(viteBin)) {
    throw new Error(`Could not find Vite executable at ${viteBin}`);
  }

  const preview = spawn(
    viteBin,
    ["preview", "--config", "vite.config.ts", "--host", "0.0.0.0"],
    {
      cwd: paipDir,
      detached: true,
      env: {
        ...process.env,
        PORT: String(port),
      },
      stdio: "ignore",
    },
  );

  const previewStartupError = new Promise<never>((_, reject) => {
    preview.once("error", reject);
  });

  console.log(`Starting PAIP preview smoke check at ${baseUrl}`);

  try {
    await Promise.race([waitForPreview(), previewStartupError]);

    for (const route of routes) {
      await checkRoute(route);
    }
  } finally {
    stopPreview(preview);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
