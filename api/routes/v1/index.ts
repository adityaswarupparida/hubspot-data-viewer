import Router from "express"
import userRouter from "./user"
import integrationRouter from "./integrations"
import authRouter from "./hubspot/auth"
import crmRouter from "./hubspot/crm"

const router = Router();

router.use("/", userRouter);
router.use("/integrations", integrationRouter);
router.use("/hubspot", authRouter);
router.use("/hubspot/crm", crmRouter);

export default router;