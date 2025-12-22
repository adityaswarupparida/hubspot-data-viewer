import Router from "express"
import { getContacts } from "../../../lib/hubspot/crm";
import { middleware } from "../../../middleware";

const router = Router();
router.use(middleware)

router.get("/properties/:object_type", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const objectType = req.params.object_type;
    // const response = await getProperties(objectType);
    res.json({
        message: `All properties of ${objectType} are retrieved`,
        payload: ""
    })
})

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