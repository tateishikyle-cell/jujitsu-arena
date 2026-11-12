import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { roomManager } from './src/room-manager.ts';
import { handleRoomsApi } from './src/api-handler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes for Online Multiplayer Rooms
app.all('/api/rooms*', (req, res, next) => {
  handleRoomsApi(req, res).then((handled: boolean) => {
    if (!handled) next();
  }).catch(next);
});

// Serve static frontend files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
