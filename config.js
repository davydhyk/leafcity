const dotEnv = require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DEV: process.env.DEV || false,
  MONGO_URL: process.env.MONGO_URL,
  SESSION_SECRET: process.env.SESSION_SECRET
}