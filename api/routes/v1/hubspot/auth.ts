import Router from "express"
import { exchangeOAuthGrantForTokens } from "../../../lib/hubspot/auth";
import { 
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI 
} from "../../../config";

const router = Router();
let SCOPES = 'crm.objects.contacts.read';
if (process.env.SCOPE) {
    SCOPES = (process.env.SCOPE.split(/ |, ?|%20/)).join(' ');
}

router.post("/authorize", (req, res) => {
    const authUrl =
        'https://app.hubspot.com/oauth/authorize' +
        `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
        `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`; // where to send the user after the consent page

    console.log(authUrl);
    res.redirect(authUrl);
});

router.get("/oauth-callback", async (req, res) => {
    if (req.query.code) {
        console.log('Auth grant ' + req.query.code)

        const authData = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: req.query.code
        };

        //@ts-ignore
        req.userId= "1";
        //@ts-ignore
        await exchangeOAuthGrantForTokens("1", authData);
        res.redirect(`/`);
    }

});

export default router;
