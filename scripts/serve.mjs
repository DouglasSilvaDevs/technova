/* Servidor local opcional, sem dependências. Node 18+. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.TECHNOVA_PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('TECHNOVA_PORT precisa ser uma porta válida.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let target = resolve(root, pathname.replace(/^\/+/, '') || 'index.html');
    if (target !== root && !target.startsWith(root + sep)) { response.writeHead(403); response.end('Acesso negado.'); return; }
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado.');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `A porta ${port} está ocupada. Defina TECHNOVA_PORT para usar outra.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`TechNova disponível em http://localhost:${port}\nUse Ctrl+C para encerrar.`));
