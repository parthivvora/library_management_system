const express = require("express");
const { userRegister, userLogin } = require("../controllers/user.controller");
const router = express();

// User
router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;