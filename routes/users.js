const express = require('express');
const addUser = require("../controllers/users/addUser");
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const getUsers = require("../controllers/users/getUsers");
const getUser = require("../controllers/users/getUser");
const router = express.Router();

/* GET users listing. */
router.get('/', ctrlWrapper(getUsers));

router.get('/:username', ctrlWrapper(getUser));

router.post('/', ctrlWrapper(addUser))

module.exports = router;
