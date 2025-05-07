export const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.ADMIN_STORE_URL || "*", // fallback for dev
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };