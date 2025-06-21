import { pino, destination } from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is two levels up from utils/
const projectRoot = path.resolve(__dirname, '../../');
const logDir = path.join(projectRoot, 'logs');
const logFile = path.join(logDir, 'app.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Only log to file
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, destination(logFile));

export default logger; 