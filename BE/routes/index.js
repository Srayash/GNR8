const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const predictRouter = require("./predict");

router.use("/user", userRouter);
router.use("/generate", predictRouter);

module.exports = router;