const { authRoute } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/UserModel");
const express = require("express");
const router = express.Router();
const { createUser, getUserInfo } = require("../controllers/userController");
router.get("/me", authRoute, getUserInfo);

router.post("/", createUser);
router.get("/test",(req,res)=>{
    res.json({message:"success"})
})

module.exports = router;
