const express = require("express");
const router = express();

// Admin
router.post(
  "/login",
  postAdminLogin
);

module.exports = router;