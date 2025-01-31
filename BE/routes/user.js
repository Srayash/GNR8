const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

const signupBody = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid Inputs",
        });
    }

    if (!(req.body.password === req.body.confirmPassword)) {
        return res.status(411).json({
            message: "Passwords don't match",
        });
    }

    const existingUser = await User.findOne({
        email: req.body.email,
    });

    if (existingUser) {
        res.status(411).json({
            message: "Email already in use.",
        });
        return;
    }

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
    });

    const userId = user._id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    res.setHeader("Authorization", `Bearer ${token}`);

    res.json({
        message: "User Created Successfully",
        name: user.email,
    });
});

module.exports = router;