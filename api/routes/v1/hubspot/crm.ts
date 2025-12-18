import Router from "express"
import { getContacts } from "../../../lib/hubspot/crm";

const router = Router();

router.get("/contacts", async (req, res) => {
    const userId = "1";
    const response = await getContacts(userId);
    res.json({
        message: "All contacts retrieved",
        payload: response
    })
});

export default router;