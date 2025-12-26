import Router from "express"
import { exchangeOAuthGrantForTokens } from "../../../lib/hubspot/auth";
import { 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI 
} from "../../../config";
import { middleware } from "../../../middleware";
import { prisma } from "../../../db";

const router = Router();
let SCOPES = 'crm.objects.contacts.read';
if (process.env.SCOPE) {
    SCOPES = (process.env.SCOPE.split(/ |, ?|%20/)).join(' ');
}

router.post("/authorize", middleware, (req, res) => {
    const STATE = JSON.stringify({ id: req.userId });
    const authUrl =
        'https://app.hubspot.com/oauth/authorize' +
        `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
        `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` + // where to send the user after the consent page
        `&state=${encodeURIComponent(STATE)}`;

    console.log(authUrl);
    res.json({
        redirectUrl: authUrl
    });
});

router.get("/oauth-callback", async (req, res) => {
    const { code, state } = req.query;

    if (code && typeof code == "string" && state) {
        console.log('Auth grant ' + code)

        const authData = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        });

        if (typeof state !== "string")
            return;
        
        const userId = JSON.parse(state).id;
        await exchangeOAuthGrantForTokens(userId, authData);
        // create access record for the HubSpot integration (valid for 24 hours)
        await prisma.integrationAccess.create({
            data: {
                userId: userId as string,
                type: "HUBSPOT",
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        res.redirect(`http://localhost:3001`);
    }

});

export default router;
