import axios from "axios";
import type { TokenResponse } from "../../types";
import { redis } from "../../redis";
import { 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI 
} from "../../config";

export const exchangeOAuthGrantForTokens = async (userId: string, authData: any) => {
    try {
        const response = await axios.post<TokenResponse>(`https://api.hubapi.com/oauth/v1/token`, authData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const tokens = response.data;
        // save access_token and refresh_token in redis
        await redis.set(`hubspot:refresh_token:${userId}`, tokens.refresh_token);
        await redis.set(`hubspot:access_token:${userId}`, tokens.access_token, {
            condition: "NX",
            expiration: {
                type: "EX",
                value: tokens.expires_in
            }
        });

    } catch (err) {
        console.error(`Error exchanging ${authData.grant_type} for access token`);

        if (axios.isAxiosError(err)) {
            console.log(`Error while connecting to hubspot oauth2 server: ` + err.message);
        } else {
            console.error(err);
        }
    }
}

export const refreshAccessToken = async (userId: string) => {
    const refreshToken = await redis.get(`hubspot:refresh_token:${userId}`);
    console.log(refreshToken);
    if (!refreshToken) return;

    const authData = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: refreshToken
    });

    await exchangeOAuthGrantForTokens(userId, authData);
}

export const getAccessToken = async (userId: string) => {
    let accessToken = await redis.get(`hubspot:access_token:${userId}`);

    if (!accessToken) {
        console.log(`Refreshing expired access token`);
        await refreshAccessToken(userId);
        accessToken = await redis.get(`hubspot:access_token:${userId}`);
    }
    
    return accessToken;
}
