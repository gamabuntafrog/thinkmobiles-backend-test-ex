const express = require('express');
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const register = require('../controllers/auth/register')
const login = require('../controllers/auth/login')
const getCurrent = require("../controllers/auth/getCurrent");
const auth = require("../middlewares/auth");
const logout = require("../controllers/auth/logout");

const router = express.Router();

router.post('/register', ctrlWrapper(register))

router.post('/login', ctrlWrapper(login))

router.post('/logout', ctrlWrapper(logout))

router.get('/current', ctrlWrapper(auth), ctrlWrapper(getCurrent))

module.exports = router;
