const express = require("express");
const router = express.Router();
const predictRouter = require("./predict");
const deployRouter = require("./deploy");

router.use("/generate", predictRouter);
router.use("/deploy", deployRouter);

module.exports = router;