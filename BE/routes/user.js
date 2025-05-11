const express = require("express");
const z = require("zod");
const User = require("../models/userModel");

const router = express.Router();

const signupBody = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid inputs" });
    }

    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ email, password });

    req.login(user, (err) => {
        if (err) {
            return res.status(500).json({ message: "Login after signup failed" });
        }

        return res.status(201).json({
            message: "User created and signed in successfully",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    });
});

module.exports = router;
