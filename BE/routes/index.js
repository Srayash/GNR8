const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const predictRouter = require("./predict");
const deployRouter = require("./deploy");

router.use("/user", userRouter);
router.use("/generate", predictRouter);
router.use("/deploy", deployRouter);

module.exports = router;