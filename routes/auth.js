const express = require("express");
const router = express.Router();
const {signup, signin, signout} = require("../controllers/auth");
const { check } = require('express-validator');

router.post("/signup", [
     check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long!'),
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long!')
     ], signup);

router.post("/signin", [
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 5 }).withMessage('Password must contain more than 5 letters!')
     ], signin);

router.get("/signout", signout);

module.exports = router;