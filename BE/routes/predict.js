const express = require("express");
const z = require("zod");
const axios = require("axios");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

const predictBody = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"), 
});

const followUpBody = z.object({
    prompt: z.string().min(1, "Improvement prompt Can't be empty"),
})

router.post("/",authMiddleware,async (req, res) => {
        const validation = predictBody.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
                errors: validation.error.errors,
            });
        }
    
        const { prompt } = req.body;
    
        try {
            const { data } = await axios.post("http://localhost:8000/predict/", { prompt });
    
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

router.post("/improvement", authMiddleware, async(req,res)=>{
    const validation = followUpBody.safeParse(req.body);
    if(!validation.success) {
        return res.status(400).json({
            message: "Invalid Inputs",
            errors: validation.error.errors,
        });
    }

    const {prompt} = req.body;

    try{
        const {data} = await axios.post("http://localhost:8000/followup/", {prompt});

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
