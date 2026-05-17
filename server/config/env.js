import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error(
    '[env] Missing server/.env — copy server/.env.example to server/.env and set your values.'
  );
  process.exit(1);
}

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('[env] Failed to load .env:', result.error.message);
  process.exit(1);
}

function cleanEnvValue(value) {
  if (value == null) return '';
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function isPlaceholderKey(value) {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.startsWith('your_') ||
    lower.includes('your_adzuna') ||
    lower.includes('your_google') ||
    lower === 'paste_your_key_here'
  );
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: cleanEnvValue(process.env.MONGO_URI),
  jwtSecret: cleanEnvValue(process.env.JWT_SECRET),
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  adzunaAppId: (() => {
    const key = cleanEnvValue(process.env.ADZUNA_APP_ID);
    if (isPlaceholderKey(key)) return '';
    return key;
  })(),
  adzunaAppKey: (() => {
    const key = cleanEnvValue(process.env.ADZUNA_APP_KEY);
    if (isPlaceholderKey(key)) return '';
    return key;
  })(),
  geminiApiKey: (() => {
    const key = cleanEnvValue(process.env.GEMINI_API_KEY);
    if (isPlaceholderKey(key)) return '';
    return key;
  })(),
};

export const validateEnv = () => {
  const missing = [];
  if (!env.mongoUri) missing.push('MONGO_URI');
  if (!env.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    console.error(`[env] Missing required variables in server/.env: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (env.adzunaAppId && env.adzunaAppKey) {
    console.log(`[env] ADZUNA API KEY loaded (***${env.adzunaAppKey.slice(-4)})`);
  } else {
    console.warn('[env] ADZUNA credentials not set — job search uses fallback on API errors');
  }

  if (env.geminiApiKey) {
    console.log(`[env] GEMINI_API_KEY loaded (***${env.geminiApiKey.slice(-4)})`);
    console.log('[env] Gemini model configured and ready');
  } else {
    console.warn('[env] GEMINI_API_KEY not set — interview prep uses fallback responses');
  }

  console.log('[env] Loaded server/.env successfully');
  console.log(`[env] PORT=${env.port} NODE_ENV=${env.nodeEnv} CLIENT_URL=${env.clientUrl}`);
};

export const corsOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
