const express = require("express");

const router = express.Router();
const dataController = require("../controllers/dataController.js");

// Route to insert data
router.post("/insert", dataController.insertData);

// Route to check new data
router.get("/new", dataController.checkNewData);

module.exports = router;
