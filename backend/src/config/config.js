// backend/src/config/config.js
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_DATABASE = process.env.DB_DATABASE || "novum_app_db";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "rs85047928084765";