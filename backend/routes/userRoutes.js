const express = require("express");
const router = express.Router();
const { signUp, login,logout,verifyToken } = require("../controllers/userData");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-token", verifyToken); 

module.exports = router;
