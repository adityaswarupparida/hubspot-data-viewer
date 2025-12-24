import Router from "express"
import { 
    getContacts, 
    getObjects, 
    getProperties 
} from "../../../lib/hubspot/crm";
import { middleware } from "../../../middleware";

const router = Router();
router.use(middleware)

router.get("/objects", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const response = await getObjects(userId);
    res.json({
        message: `All the objects are retrieved`,
        payload: response
    })
});

router.get("/properties/:object_type", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const objectType = req.params.object_type;
    const response = await getProperties(userId, objectType);
    res.json({
        message: `All properties of ${objectType} are retrieved`,
        payload: response
    })
});

router.get("/contacts", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const response = await getContacts(userId, "");
    res.json({
        message: "All contacts retrieved",
        payload: response
    })
});

router.post("/contacts", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const queryParams = req.body.params;
    const response = await getContacts(userId, queryParams);
    res.json({
        message: "All contacts retrieved",
        payload: response
    })
});

export default router;