require('dotenv').config();

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://na-database.vercel.app',
  new RegExp('https:\/\/fe-na-database-.*-xploratech\.vercel\.app'),
  'https://fe-na-database-k1czrpt89-xploratech.vercel.app',
];

module.exports = {
  ALLOWED_ORIGINS: allowedOrigins,
  API_VERSION: process.env.API_VERSION,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  // DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  TOKEN_ALGORITHM: process.env.TOKEN_ALGORITHM,
  TOKEN_ISSUER: process.env.TOKEN_ISSUER,
  TOKEN_AUDIENCE: process.env.TOKEN_AUDIENCE,
  ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
  COOKIE_MAX_AGE: process.env.COOKIE_MAX_AGE,
  REFRESH_TOKEN_EXPIRE_TIME: process.env.REFRESH_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_EXPIRE_TIME: process.env.ACCESS_TOKEN_EXPIRE_TIME,
};