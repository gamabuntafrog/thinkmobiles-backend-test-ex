const express = require('express');
const addEvent = require("../controllers/events/addEvent");
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const getUserEvents = require("../controllers/events/getUserEvents");
const validateDate = require("../controllers/events/validateDate");
const eventForUsersSchema = require("../schemas/eventForUsers");
const checkValidation = require("../middlewares/checkValidation");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get('/users/:id', ctrlWrapper(auth), ctrlWrapper(getUserEvents))

router.post('/users/:userId/validateDate', ctrlWrapper(auth), ctrlWrapper(validateDate))

router.post('/users/:userId', ctrlWrapper(auth), ...eventForUsersSchema, checkValidation, ctrlWrapper(addEvent))


module.exports = router;
