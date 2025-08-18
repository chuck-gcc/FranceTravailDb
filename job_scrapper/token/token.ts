import axios from "axios"
import qs from "qs"

export interface Token
{
    access_token: string,
    scope: string,
    token_type: string,
    expires_in: number
}

import dotenv from "dotenv";

dotenv.config();

export async function getToken(): Promise<any | null> {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const scope = process.env.SCOPES_API;


    if (!client_id || !client_secret || !scope) {
        throw new Error("❌ Missing environment variables");
    }

    const data = qs.stringify({
        grant_type: "client_credentials",
        client_id,
        client_secret,
        scope
    });
    console.log(client_id)
    const url = "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=partenaire";

    try {
        const res = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        //console.log("✅ Token reçu :", res.data);
        return res.data;
    } catch (error: any) {
        console.error("❌ Erreur axios:", error.response?.data || error.message);
        return null;
    }
}
