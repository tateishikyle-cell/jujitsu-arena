import type { IncomingMessage, ServerResponse } from 'http';
import { roomManager } from './room-manager.ts';

function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('不正なJSONリクエストです'));
      }
    });
    req.on('error', reject);
  });
}

function extractToken(req: IncomingMessage): string {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return '';
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export async function handleRoomsApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (!pathname.startsWith('/api/rooms')) {
    return false;
  }

  const sub = pathname.replace(/^\/api\/rooms\/?/, '');
  const parts = sub.split('/').filter(Boolean);
  const method = req.method?.toUpperCase();

  try {
    // POST /api/rooms -> create
    if (parts.length === 0 && method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.character) {
        sendJson(res, 400, { error: 'キャラクターを選択してください' });
        return true;
      }
      const { room, token } = roomManager.createRoom(body.character, body.vow, body.size);
      sendJson(res, 200, { ...room, token });
      return true;
    }

    // POST /api/rooms/:code/join
    if (parts.length === 2 && parts[1] === 'join' && method === 'POST') {
      const code = parts[0];
      const body = await readJsonBody(req);
      if (!body.character) {
        sendJson(res, 400, { error: 'キャラクターを選択してください' });
        return true;
      }
      const { room, token } = roomManager.joinRoom(code, body.character, body.vow);
      sendJson(res, 200, { ...room, token });
      return true;
    }

    // GET /api/rooms/:code
    if (parts.length === 1 && method === 'GET') {
      const code = parts[0];
      const token = extractToken(req);
      const room = roomManager.getRoom(code, token);
      sendJson(res, 200, room);
      return true;
    }

    // POST /api/rooms/:code/move
    if (parts.length === 2 && parts[1] === 'move' && method === 'POST') {
      const code = parts[0];
      const token = extractToken(req);
      const body = await readJsonBody(req);
      const room = roomManager.submitMove(code, token, body.index, body.target, body.revision);
      sendJson(res, 200, room);
      return true;
    }

    // POST /api/rooms/:code/leave
    if (parts.length === 2 && parts[1] === 'leave' && method === 'POST') {
      const code = parts[0];
      const token = extractToken(req);
      const room = roomManager.leaveRoom(code, token);
      sendJson(res, 200, room);
      return true;
    }

    sendJson(res, 404, { error: 'エンドポイントが見つかりません' });
    return true;
  } catch (err: any) {
    const status = err.status || 400;
    sendJson(res, status, { error: err.message || 'エラーが発生しました' });
    return true;
  }
}
