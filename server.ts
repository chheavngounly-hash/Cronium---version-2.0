import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FEEDBACK_DIR = path.join(__dirname, '.data');
const FEEDBACK_CSV_PATH = path.join(FEEDBACK_DIR, 'feedback-submissions.csv');
const STATIC_ASSET_EXT_RE =
  /\.(?:js|mjs|cjs|css|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|json|wasm|txt|xml|pdf|mp4|webm|mp3|wav)$/i;
const COMPRESSIBLE_EXT_RE = /\.(?:html|js|mjs|cjs|css|svg|json|txt|xml|md)$/i;

function resolvePort(): number {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--port' && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
    } else if (arg.startsWith('--port=')) {
      const parsed = Number(arg.slice('--port='.length));
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
    }
  }
  const envPort = Number(process.env.PORT);
  return Number.isInteger(envPort) && envPort > 0 ? envPort : 3000;
}

const escapeCsvCell = (value: string): string => {
  const formulaSafe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${formulaSafe.replace(/"/g, '""')}"`;
};

async function appendPrivateFeedbackRow(comment: string, submittedAt: string): Promise<void> {
  try {
    await fs.mkdir(FEEDBACK_DIR, { recursive: true });
    let needsHeader = false;
    try {
      await fs.access(FEEDBACK_CSV_PATH);
    } catch {
      needsHeader = true;
    }
    const line = `${escapeCsvCell(submittedAt)},${escapeCsvCell(comment)}\n`;
    if (needsHeader) {
      await fs.writeFile(FEEDBACK_CSV_PATH, `Submitted At,Comment\n${line}`, 'utf8');
    } else {
      await fs.appendFile(FEEDBACK_CSV_PATH, line, 'utf8');
    }
  } catch {
    // Ignore filesystem errors on read-only environments
  }
}

const isSharePointViewerUrl = (rawUrl: string): boolean => {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;
    if (host.endsWith('sharepoint.com') && /\/:(x|w|p|b|o):/i.test(pathname)) {
      return true;
    }
    if (host === '1drv.ms' || host.endsWith('onedrive.live.com')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

function createGzipStaticMiddleware(distDir: string) {
  const cache = new Map<string, { gz: Buffer; mtimeMs: number; contentType: string }>();

  const getContentType = (ext: string): string => {
    switch (ext) {
      case '.js':
      case '.mjs':
      case '.cjs':
        return 'application/javascript; charset=utf-8';
      case '.css':
        return 'text/css; charset=utf-8';
      case '.svg':
        return 'image/svg+xml';
      case '.json':
        return 'application/json; charset=utf-8';
      case '.html':
        return 'text/html; charset=utf-8';
      case '.md':
      case '.txt':
        return 'text/plain; charset=utf-8';
      default:
        return 'application/octet-stream';
    }
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    if (!acceptEncoding.includes('gzip')) {
      next();
      return;
    }
    const reqPath = req.path || '/';
    if (!COMPRESSIBLE_EXT_RE.test(reqPath) || reqPath.endsWith('/index.html')) {
      next();
      return;
    }

    const safeRel = path.posix.normalize(reqPath).replace(/^\/+/, '');
    if (safeRel.startsWith('..')) {
      next();
      return;
    }
    const absPath = path.resolve(distDir, safeRel);
    if (!absPath.startsWith(distDir + path.sep)) {
      next();
      return;
    }

    try {
      const stat = await fs.stat(absPath);
      if (!stat.isFile() || stat.size < 1024) {
        next();
        return;
      }

      let entry = cache.get(absPath);
      if (!entry || entry.mtimeMs !== stat.mtimeMs) {
        const raw = await fs.readFile(absPath);
        const gz = zlib.gzipSync(raw, { level: 6 });
        const ext = path.extname(absPath).toLowerCase();
        entry = { gz, mtimeMs: stat.mtimeMs, contentType: getContentType(ext) };
        if (cache.size > 100) cache.clear();
        cache.set(absPath, entry);
      }

      res.setHeader('Content-Type', entry.contentType);
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader(
        'Cache-Control',
        reqPath.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
      );
      res.setHeader('Content-Length', String(entry.gz.length));
      if (req.method === 'HEAD') {
        res.status(200).end();
      } else {
        res.status(200).send(entry.gz);
      }
    } catch {
      next();
    }
  };
}

function mountStaticProductionRoutes(app: express.Express, distDir: string, distIndexPath: string) {
  app.use(createGzipStaticMiddleware(distDir));

  app.use(
    express.static(distDir, {
      index: false,
      setHeaders(res, filePath) {
        const normalized = filePath.replace(/\\/g, '/');
        if (normalized.endsWith('/index.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else if (normalized.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    })
  );

  // Never fall through API or missing static asset paths to index.html (avoids JS MIME-type mismatch errors)
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.get('/{*splat}', (req: Request, res: Response) => {
    const reqPath = req.path || '/';
    if (reqPath.startsWith('/assets/') || STATIC_ASSET_EXT_RE.test(reqPath)) {
      res.status(404).type('text/plain').send('Asset not found');
      return;
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', 'Accept-Encoding');
    res.sendFile(distIndexPath, (err) => {
      if (err && !res.headersSent) {
        res.status(500).type('text/plain').send('Unable to load application');
      }
    });
  });
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.disable('x-powered-by');
  const port = resolvePort();

  app.use(express.json({ limit: '64kb' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.post('/api/feedback', async (req: Request, res: Response) => {
    const rawComment = typeof req.body?.comment === 'string' ? req.body.comment : '';
    const comment = rawComment.trim();

    if (!comment) {
      res.status(400).json({ error: 'Write your feedback or comments before sending.' });
      return;
    }

    const submittedAt = new Date().toISOString();
    await appendPrivateFeedbackRow(comment, submittedAt);

    const rawEnvValue = (
      process.env.FEEDBACK_WEBHOOK_URL ||
      process.env.VITE_FEEDBACK_WEBHOOK_URL ||
      ''
    )
      .trim()
      .replace(/^[\\"'`\s]+|[\\"'`\s]+$/g, '')
      .trim();

    const extractedUrlMatch = rawEnvValue.match(/https?:\/\/[^\s"'`<>]+/i);
    if (!extractedUrlMatch) {
      res.status(200).json({ ok: true, mode: 'server' });
      return;
    }

    let parsedWebhook: URL;
    try {
      const normalizedExtractedUrl = extractedUrlMatch[0].replace(/&amp;/g, '&');
      parsedWebhook = new URL(normalizedExtractedUrl);
      if (parsedWebhook.protocol !== 'http:' && parsedWebhook.protocol !== 'https:') {
        res.status(200).json({ ok: true, mode: 'server' });
        return;
      }
    } catch {
      res.status(200).json({ ok: true, mode: 'server' });
      return;
    }

    const targetWebhookUrl = parsedWebhook.toString();

    if (isSharePointViewerUrl(targetWebhookUrl)) {
      res.status(400).json({
        error:
          'A SharePoint Excel view link cannot accept direct feedback writes. Connect a Power Automate HTTP webhook URL ("When an HTTP request is received" -> "Add a row into a table") to send rows into the Excel file.',
      });
      return;
    }

    try {
      const isAppsScript = parsedWebhook.hostname.toLowerCase().includes('script.google.com');
      const upstream = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          comment,
          feedback: comment,
          message: comment,
          submittedAt,
        }),
        redirect: isAppsScript ? 'manual' : 'follow',
        signal: AbortSignal.timeout(10000),
      });

      const acceptedAppsScriptRedirect =
        isAppsScript && upstream.status >= 300 && upstream.status < 400;

      if (!upstream.ok && !acceptedAppsScriptRedirect) {
        res.status(502).json({
          error: `Spreadsheet webhook returned HTTP ${upstream.status}. Check that your flow is turned on and accepts JSON POST requests.`,
        });
        return;
      }

      res.status(200).json({ ok: true, mode: 'webhook' });
    } catch {
      res.status(502).json({
        error: 'Could not reach the spreadsheet webhook endpoint. Please verify the webhook URL and try again.',
      });
    }
  });

  const distDir = path.resolve(__dirname, 'dist');
  const distIndexPath = path.join(distDir, 'index.html');
  let hasDistBuild = false;
  try {
    await fs.access(distIndexPath);
    hasDistBuild = true;
  } catch {
    hasDistBuild = false;
  }

  const isExplicitProd = process.env.NODE_ENV === 'production';
  const isStartScript = process.env.npm_lifecycle_event === 'start';
  const isDevScript = process.env.npm_lifecycle_event === 'dev';
  const isExplicitDev = process.env.NODE_ENV === 'development';
  const isRunningUnderTsx = process.execArgv.some((arg) => arg.toLowerCase().includes('tsx'));

  const shouldUseViteDev =
    !hasDistBuild ||
    (!isExplicitProd &&
      !isStartScript &&
      (isDevScript || isExplicitDev || isRunningUnderTsx));

  if (shouldUseViteDev) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          allowedHosts: true,
          cors: true,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      if (hasDistBuild) {
        console.warn('Vite dev server unavailable, falling back to built dist/ assets:', viteErr);
        mountStaticProductionRoutes(app, distDir, distIndexPath);
      } else {
        throw viteErr;
      }
    }
  } else {
    mountStaticProductionRoutes(app, distDir, distIndexPath);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
