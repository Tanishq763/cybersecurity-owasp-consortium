import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { createServer as createViteServer, loadEnv } from 'vite';

const isDev = process.argv.includes('--dev');
const mode = isDev ? 'development' : 'production';
const env = loadEnv(mode, process.cwd(), '');
const apiKey = process.env.IMGBB_API_KEY || env.IMGBB_API_KEY;
const registrationUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL || env.GOOGLE_SHEETS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbysloLgczyRddDHWNZ-tQG61d8_THTZpwTAUipV_Xawe7QZwINurJPvTP-9AWZB0OgA/exec';
const registrationToken = process.env.REGISTRATION_API_TOKEN || env.REGISTRATION_API_TOKEN;
const maxImageBytes = 8 * 1024 * 1024;
const maxRequestBytes = Math.ceil(maxImageBytes / 3) * 4 + 1024;
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

function isValidImage(buffer, mimeType) {
  if (mimeType === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === 'image/gif') return ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6));
  if (mimeType === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  if (mimeType === 'image/avif') return buffer.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(buffer.toString('ascii', 8, 12));
  return false;
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;
  let tooLarge = false;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) {
      tooLarge = true;
      chunks.length = 0;
    } else if (!tooLarge) {
      chunks.push(chunk);
    }
  }
  if (tooLarge) throw Object.assign(new Error('Image must be 8 MB or smaller.'), { statusCode: 413 });
  return Buffer.concat(chunks).toString('utf8');
}

async function handleImageUpload(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }
  if (!apiKey) {
    sendJson(response, 503, { error: 'Image uploads are not configured on the server.' });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request));
    if (typeof body.image !== 'string' || !imageTypes.has(body.mimeType)) {
      sendJson(response, 400, { error: 'Upload a supported image file.' });
      return;
    }
    const image = Buffer.from(body.image, 'base64');
    if (!image.length || image.length > maxImageBytes || !isValidImage(image, body.mimeType)) {
      sendJson(response, 400, { error: 'The uploaded file is not a valid supported image.' });
      return;
    }

    const uploadUrl = new URL('https://api.imgbb.com/1/upload');
    uploadUrl.searchParams.set('key', apiKey);
    const upstream = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ image: body.image }),
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !result.success || !result.data?.url) {
      const message = result.error?.message || `ImgBB returned HTTP ${upstream.status}.`;
      console.error('ImgBB upload rejected:', { status: upstream.status, code: result.error?.code, message });
      sendJson(response, 502, { error: `ImgBB could not save the payment screenshot: ${message}` });
      return;
    }
    sendJson(response, 200, { url: result.data.url });
  } catch (error) {
    sendJson(response, error.statusCode || 502, {
      error: error.statusCode ? error.message : 'The payment screenshot could not be uploaded. Try again.',
    });
  }
}

async function handleRegistration(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }
  if (!registrationToken) {
    sendJson(response, 503, { error: 'Google Sheets submission is not configured on the server.' });
    return;
  }

  try {
    const body = JSON.parse(await readRequestBody(request));
    if (!['manit', 'outside'].includes(body.participantType) || !body.fields || typeof body.fields !== 'object') {
      sendJson(response, 400, { error: 'Registration details are incomplete.' });
      return;
    }
    if (body.participantType === 'outside' && !['solo', 'combo'].includes(body.plan)) {
      sendJson(response, 400, { error: 'Select a valid participation type.' });
      return;
    }
    const paymentImageUrl = String(body.paymentImageUrl || '');
    if (body.participantType === 'outside' && !/^https:\/\/(?:i\.)?ibb\.co\//i.test(paymentImageUrl)) {
      sendJson(response, 400, { error: 'Upload the payment screenshot before submitting.' });
      return;
    }

    const upstream = await fetch(registrationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantType: body.participantType,
        plan: body.participantType === 'outside' ? body.plan : '',
        fields: body.fields,
        paymentImageUrl,
        apiToken: registrationToken,
      }),
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.success !== true) {
      const message = result.error || `Registration service returned HTTP ${upstream.status}.`;
      console.error('Google Sheets registration rejected:', { status: upstream.status, message });
      sendJson(response, 502, { error: message });
      return;
    }
    sendJson(response, 200, { success: true });
  } catch (error) {
    sendJson(response, error.statusCode || 502, {
      error: error.statusCode ? error.message : 'Could not save the registration. Please try again.',
    });
  }
}

function attachUploadRoute(server) {
  server.middlewares.use('/api/payment-image', (request, response) => {
    handleImageUpload(request, response).catch(() => {
      sendJson(response, 500, { error: 'The payment screenshot could not be uploaded. Try again.' });
    });
  });
}

function attachRegistrationRoute(server) {
  server.middlewares.use('/api/registration', (request, response) => {
    handleRegistration(request, response).catch(() => {
      sendJson(response, 500, { error: 'Could not save the registration. Please try again.' });
    });
  });
}

async function serveBuiltFile(request, response) {
  const distDirectory = resolve(process.cwd(), 'dist');
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let filePath = resolve(distDirectory, `.${pathname}`);
  if (filePath !== distDirectory && !filePath.startsWith(`${distDirectory}${sep}`)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) filePath = resolve(distDirectory, 'index.html');
  } catch {
    filePath = resolve(distDirectory, 'index.html');
  }

  const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };
  const content = await readFile(filePath);
  response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream' });
  response.end(content);
}

if (isDev) {
  const vite = await createViteServer({
    plugins: [{
      name: 'payment-image-upload',
      configureServer(server) {
        attachUploadRoute(server);
        attachRegistrationRoute(server);
      },
    }],
  });
  await vite.listen();
  vite.printUrls();
} else {
  const port = Number(process.env.PORT || 3000);
  const server = createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/api/payment-image') {
      handleImageUpload(request, response).catch(() => {
        sendJson(response, 500, { error: 'The payment screenshot could not be uploaded. Try again.' });
      });
      return;
    }
    if (pathname === '/api/registration') {
      handleRegistration(request, response).catch(() => {
        sendJson(response, 500, { error: 'Could not save the registration. Please try again.' });
      });
      return;
    }
    serveBuiltFile(request, response).catch(() => response.writeHead(404).end());
  });
  server.listen(port, '0.0.0.0', () => console.log(`Registration app listening on port ${port}`));
}
