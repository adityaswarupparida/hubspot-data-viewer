import Router from "express"
import authRouter from "./hubspot/auth"
import crmRouter from "./hubspot/crm"

const router = Router();

router.use("/hubspot", authRouter);
router.use("/hubspot/crm", crmRouter);

export default router;