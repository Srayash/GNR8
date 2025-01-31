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
})

router.post("/signup", async (req, res) => {
    const {success} = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Invalid Inputs"
        })
    }

    if(!(req.body.password === req.body.confirmPassword)){
        return res.status(411).json({
            message: "Passwords don't match"
        })
    }

    const exisitingUser = await User.findOne({
        email: req.body.email
    })

    if(exisitingUser){
        res.status(411).json({
            message: "Email already in use."
        })
        return;
    }

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.setHeader("Authorization", `Bearer ${token}`);

    res.json({
        message: "User Created Succesfully",
        name: user.email
    })
});

const signinBody = z.object({
    email: z.string().email(),
    password: z.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid Inputs"
        });
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (!user) {
        return res.status(403).json({
            message: "Wrong Email or Password"
        });
    }

    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.setHeader("Authorization", `Bearer ${token}`);

    res.json({
        name: user.email
    });
});

module.exports = router;