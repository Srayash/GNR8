const express = require("express");
const z = require("zod");
const axios = require("axios");
const dotenv = require("dotenv");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

dotenv.config();

const BASE_MODEL_URL = process.env.MODEL_URL || "http://localhost:8000";
const BASE_BE_URL = process.env.BE_URL || "http://localhost:3000";

const predictBody = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"), 
});

const followUpBody = z.object({
    prompt: z.string().min(1, "Improvement prompt Can't be empty"),
})

router.use(requireAuth);

router.post("/",async (req, res) => {
        const validation = predictBody.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
                errors: validation.error.errors,
            });
        }
    
        const { prompt } = req.body;
    
        try {
            const { data } = await axios.post(`${BASE_MODEL_URL}/predict/`, { prompt });
    
            return res.status(200).json({
                message: "Prediction successful",
                data, 
            });
        } catch (error) {
            console.error("Error making prediction request:", error.message);
    
            return res.status(error.response?.status || 500).json({
                message: "Failed to make prediction",
                error: error.response?.data || "Internal Server Error",
            });
        }
});

router.post("/improvement", async(req,res)=>{
    const validation = followUpBody.safeParse(req.body);
    if(!validation.success) {
        return res.status(400).json({
            message: "Invalid Inputs",
            errors: validation.error.errors,
        });
    }

    const {prompt} = req.body;

    try{
        const {data} = await axios.post(`${BASE_MODEL_URL}/followup/`, {prompt});

        return res.status(200).json({
            message: "Prediction Succesfull",
            data,
        });
    } catch(error) {
        console.error("Error making prediction request:", error.message);

        return res.status(error.response?.status || 500).json({
            message: "Failed to make prediction",
            error: error.response?.data || "Internal Server Error",
        });
    }
})

module.exports = router;
