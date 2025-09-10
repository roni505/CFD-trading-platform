import jwt from 'jsonwebtoken';
import { Router } from "express";
import { JWT_SECRET } from "../../../../packages/config/dist/env";

const router = Router();

router.get("/auth/verify", (req,res) => {
    const { body } = req.query;
    try {
        const token = jwt.verify(body, JWT_SECRET)        
    } catch (error) {
        console.error("Error in the auth/verify route");
    }
})