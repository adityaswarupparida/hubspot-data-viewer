export const CLIENT_ID = process.env.CLIENT_ID!;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = `${process.env.BACKEND_URL}/api/v1/hubspot/oauth-callback`;
export const HUBSPOT_URL = `https://api.hubapi.com`;
export const JWT_SECRET = process.env.JWT_SECRET!;

