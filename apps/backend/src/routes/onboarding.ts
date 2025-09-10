import emailSender from '../emailSender';
import { JWT_SECRET } from './../../../../packages/config/dist/env';
import { OnboardingSchema } from './../types';
import { Router } from "express";
import jwt from "jsonwebtoken";

const route = Router();

route.post("auth/magic-link", (req, res) => {
    const { email, success } = OnboardingSchema.safeParse(req.body;

    if(!success) {
        console.log("Incorrect input");
        res.json({
            message: "Please add correct input"
        })
    }

    const token = jwt.sign(email, JWT_SECRET);

    emailSender(email, token);
    
    res.json({
        message: "Welcome happy trading"
    })
})