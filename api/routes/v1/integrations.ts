import { Router } from "express";
import { prisma } from "../../db";
import { middleware } from "../../middleware";

const router = Router();
router.use(middleware)

router.get("/", async (req, res) => {
    const access = await prisma.integrationAccess.findFirst({
        where: {
            userId: req.userId,
            type: req.body.type,
            expiresAt: {
                gte: new Date()
            }
        }
    });

    if (!access) {
        return res.json({
            active: false
        });
    }
    
    res.json({
        active: true
    });
});

router.post("/", async (req, res) => {
    await prisma.integrationAccess.create({
        data: {
            userId: req.userId as string,
            type: req.body.type,
            expiresAt: req.body.expiresAt
        }
    });
    
    res.json({
        active: true
    });
});

export default router;