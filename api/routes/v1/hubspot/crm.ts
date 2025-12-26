import Router from "express"
import { 
    getObjects, 
    getProperties, 
    getRecords,
    searchRecords
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

// router.get("/contacts", async (req, res) => {
//     const userId = req.userId;
//     if (!userId) return;
//     const response = await getContacts(userId, "");
//     res.json({
//         message: "All contacts retrieved",
//         payload: response
//     })
// });

router.post("/records/:object_type", async (req, res) => {
    const userId = req.userId;
    if (!userId) return;
    const objectType = req.params.object_type;
    // Get Contacts API 
    // const queryParams = req.body.params;
    // Search Contacts API supporting filters
    const queryParams = req.body;
    const response = await searchRecords(userId, objectType, queryParams);
    res.json({
        message: `All records of ${objectType} are retrieved`,
        payload: response
    })
});

export default router;