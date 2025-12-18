import Router from "express"
import { getContacts } from "../../../lib/hubspot/crm";
import { middleware } from "../../../middleware";

const router = Router();
router.use(middleware)

router.get("/contacts", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const response = await getContacts(userId);
    res.json({
        message: "All contacts retrieved",
        payload: response
    })
});

export default router;