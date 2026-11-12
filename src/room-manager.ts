import crypto from 'crypto';
// @ts-ignore
import { start, actions, resolve, char } from './game/engine.js';
// @ts-ignore
import { startFreeForAll, raidActions, resolveRaid, raidAlive } from './game/raid-engine.js';

export interface RoomPlayer {
  id: string;
  vow: string;
}

export interface RoomState {
  code: string;
  size: number;
  tokens: string[];
  revision: number;
  phase: 'lobby' | 'battle' | 'finished';
  players: (RoomPlayer | null)[];
  state: any;
  logs: any[];
  locked: boolean[];
  pendingMoves: ({ index: number; target: number | null } | null)[];
  expires: number;
}

const rooms = new Map<string, RoomState>();

function generateCode(): string {
  let code = '';
  do {
    code = crypto.randomBytes(5).toString('hex').toUpperCase();
  } while (rooms.has(code));
  return code;
}

function cleanExpiredRooms() {
  const now = Date.now();
  for (const [code, r] of rooms.entries()) {
    if (r.expires < now) {
      rooms.delete(code);
    }
  }
}

setInterval(cleanExpiredRooms, 60 * 1000);

export const roomManager = {
  createRoom(character: string, vow: string, size = 2): { room: any; token: string } {
    cleanExpiredRooms();
    const validSize = size === 3 ? 3 : 2;
    const code = generateCode();
    const token = crypto.randomBytes(32).toString('hex');
    const room: RoomState = {
      code,
      size: validSize,
      tokens: [token, ...Array(validSize - 1).fill('')],
      revision: 0,
      phase: 'lobby',
      players: [{ id: character, vow: vow || 'none' }, ...Array(validSize - 1).fill(null)],
      state: null,
      logs: [],
      locked: Array(validSize).fill(false),
      pendingMoves: Array(validSize).fill(null),
      expires: Date.now() + 24 * 3600 * 1000
    };
    rooms.set(code, room);
    return {
      room: this.sanitize(room, 0),
      token
    };
  },

  joinRoom(code: string, character: string, vow: string): { room: any; token: string } {
    cleanExpiredRooms();
    const r = rooms.get(code.toUpperCase());
    if (!r) throw new Error('部屋が見つかりません');
    if (r.phase !== 'lobby') throw new Error('この部屋は既に対戦中または終了しています');

    const seat = r.players.indexOf(null);
    if (seat === -1) throw new Error('部屋は満員です');

    const token = crypto.randomBytes(32).toString('hex');
    r.tokens[seat] = token;
    r.players[seat] = { id: character, vow: vow || 'none' };

    // Check if ready to start
    if (!r.players.includes(null)) {
      r.phase = 'battle';
      r.revision++;
      const safePlayers = r.players as RoomPlayer[];
      if (r.size === 2) {
        r.state = start(safePlayers[0].id, safePlayers[1].id, [safePlayers[0].vow, safePlayers[1].vow]);
      } else {
        r.state = startFreeForAll(safePlayers);
      }
    }

    return {
      room: this.sanitize(r, seat),
      token
    };
  },

  getRoom(code: string, token: string): any {
    cleanExpiredRooms();
    const r = rooms.get(code.toUpperCase());
    if (!r) throw new Error('部屋が見つかりません');
    const seat = r.tokens.indexOf(token);
    if (seat === -1) throw new Error('認証に失敗しました');
    return this.sanitize(r, seat);
  },

  submitMove(code: string, token: string, index: number, target?: number, revision?: number): any {
    cleanExpiredRooms();
    const r = rooms.get(code.toUpperCase());
    if (!r) throw new Error('部屋が見つかりません');
    const seat = r.tokens.indexOf(token);
    if (seat === -1) throw new Error('認証に失敗しました');
    if (r.phase !== 'battle') throw new Error('対戦中ではありません');
    if (revision !== undefined && r.revision !== revision) {
      // 409 conflict
      const err: any = new Error('ターンが更新されました');
      err.status = 409;
      throw err;
    }

    r.pendingMoves[seat] = { index, target: target !== undefined ? target : null };
    r.locked[seat] = true;

    // Check if resolution condition met
    let ready = false;
    if (r.state.court) {
      // Court trial: only defendant acts
      const def = r.state.court.defendant;
      if (r.locked[def]) {
        ready = true;
      }
    } else if (r.size === 2) {
      if (r.locked[0] && r.locked[1]) {
        ready = true;
      }
    } else {
      // 3-player FFA: all alive players must lock
      const alive = raidAlive(r.state);
      if (alive.every((s: number) => r.locked[s])) {
        ready = true;
      }
    }

    if (ready) {
      this.resolveTurn(r);
    }

    return this.sanitize(r, seat);
  },

  resolveTurn(r: RoomState): void {
    if (r.state.court) {
      const def = r.state.court.defendant;
      const acts = actions(r.state, def);
      const move = acts[r.pendingMoves[def]?.index || 0] || acts[0];
      const result: any = resolve(r.state, def === 0 ? move : null, def === 1 ? move : null);
      r.logs.unshift({
        turn: r.state.turn,
        moves: result.moves,
        log: result.log,
        trial: result.trial || true
      });
      r.logs = r.logs.slice(0, 80);
      r.state = result.s;
    } else if (r.size === 2) {
      const move0 = actions(r.state, 0)[r.pendingMoves[0]?.index || 0] || actions(r.state, 0)[0];
      const move1 = actions(r.state, 1)[r.pendingMoves[1]?.index || 0] || actions(r.state, 1)[0];
      const result: any = resolve(r.state, move0, move1);
      r.logs.unshift({
        turn: r.state.turn,
        moves: result.moves,
        log: result.log,
        trial: result.trial || false
      });
      r.logs = r.logs.slice(0, 80);
      r.state = result.s;
      if (r.state.p.some((p: any) => p.hp <= 0) || r.state.turn > 100) {
        r.phase = 'finished';
      }
    } else {
      // 3-player FFA
      const alive = raidAlive(r.state);
      const moves = r.state.p.map((p: any, seat: number) => {
        if (p.hp <= 0) return raidActions(r.state, seat, 0)[0];
        const tgt = r.pendingMoves[seat]?.target ?? (alive.find((i: number) => i !== seat) || 0);
        const acts = raidActions(r.state, seat, tgt);
        return acts[r.pendingMoves[seat]?.index || 0] || acts[0];
      });
      const targets = r.state.p.map((_: any, seat: number) => {
        return r.pendingMoves[seat]?.target ?? (alive.find((i: number) => i !== seat) || 0);
      });
      const result = resolveRaid(r.state, moves, targets);
      r.logs.unshift({
        turn: r.state.turn,
        moves: result.moves,
        log: result.log,
        trial: result.trial || false
      });
      r.logs = r.logs.slice(0, 80);
      r.state = result.s;
      if (raidAlive(r.state).length < 2 || r.state.turn > 100) {
        r.phase = 'finished';
      }
    }

    r.revision++;
    r.locked = Array(r.size).fill(false);
    r.pendingMoves = Array(r.size).fill(null);
  },

  leaveRoom(code: string, token: string): any {
    cleanExpiredRooms();
    const r = rooms.get(code.toUpperCase());
    if (!r) throw new Error('部屋が見つかりません');
    const seat = r.tokens.indexOf(token);
    if (seat === -1) throw new Error('認証に失敗しました');

    r.phase = 'finished';
    r.revision++;
    const player = r.players[seat];
    const charData = player?.id ? char(player.id) : null;
    const name = charData?.name || (player?.id ? player.id : `プレイヤー${seat + 1}`);
    r.logs.unshift({
      turn: r.state?.turn || 1,
      moves: [{ n: `${name}が降参` }],
      log: [`${name}が対戦から降参しました。対戦を終了します。`]
    });

    return this.sanitize(r, seat);
  },

  sanitize(r: RoomState, seat: number): any {
    return {
      code: r.code,
      seat,
      revision: r.revision,
      phase: r.phase,
      players: r.players,
      state: r.state,
      logs: r.logs,
      locked: r.locked,
      expires: r.expires
    };
  }
};
