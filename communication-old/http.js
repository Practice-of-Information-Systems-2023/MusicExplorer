const { getUserData, addUserData } = require("./userdata.js");

const express = require("express");
const router = express.Router();

router.get("/test/getUsers", (req, res) => {
  res.set({ "Access-Control-Allow-Origin": "*" });
  const userData = getUserData();
  res.json(userData);
});

module.exports = router;
