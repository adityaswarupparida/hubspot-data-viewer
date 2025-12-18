import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../../types";
import { prisma } from "../../db";
import { JWT_SECRET } from "../../config";

const router = Router();
const SALT_ROUNDS = 10;

router.post("/signup", async (req, res) => {
    const parsedBody = UserSchema.safeParse(req.body);
    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({
            message: "Bad Request: " + parsedBody.error
        })
    }

    const hashedPassword = await bcrypt.hash(parsedBody.data.password, SALT_ROUNDS);
    // Save username and hashed password to db
    const user = await prisma.user.create({ 
        data: {
            username: parsedBody.data.username,
            password: hashedPassword
        }
     })

    const token = jwt.sign({
        sub: user.id
    }, JWT_SECRET);

    res.status(201).json({
        id: user.id,
        token
    });

});

router.post("/signin", async (req, res) => {
    const parsedBody = UserSchema.safeParse(req.body);
    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({
            message: "Bad Request: " + parsedBody.error
        });
    }

    // Get the user from username and compare the password with hashed password from db
    const user = await prisma.user.findUnique({
        where: {
            username: parsedBody.data.username
        }
    });

    if (!user) {
        return res.status(404).json({
            message: "Forbidden: User doesn't exist with email. Please sign up"
        });
    }

    const result =  await bcrypt.compare(parsedBody.data.password, user.password);
    if (!result) {
        return res.status(403).json({
            message: "Unauthorized: Incorrect password"
        })
    }

    const token = jwt.sign({
        sub: user.id
    }, JWT_SECRET);

    res.status(200).json({
        id: user.id,
        token
    });
});

export default router;