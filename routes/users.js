const express = require('express');
const addUser = require("../controllers/users/addUser");
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const getUsers = require("../controllers/users/getUsers");
const getUser = require("../controllers/users/getUser");
const router = express.Router();
const checkValidation = require("../middlewares/checkValidation");
const userForEventsSchema = require("../schemas/userForEvents");
const auth = require("../middlewares/auth");
const deleteUser = require('../controllers/users/deleteUser');

router.get('/', ctrlWrapper(auth), ctrlWrapper(getUsers));

router.get('/:id', ctrlWrapper(auth), ctrlWrapper(getUser));

router.post('/', ctrlWrapper(auth), ...userForEventsSchema, checkValidation, ctrlWrapper(addUser))

router.delete('/:id', ctrlWrapper(auth), ctrlWrapper(deleteUser))


module.exports = router;
