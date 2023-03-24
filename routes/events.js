const express = require('express');
const addEvent = require("../controllers/events/addEvent");
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const getUserEvents = require("../controllers/events/getUserEvents");
const validateDate = require("../controllers/events/validateDate");
const eventForUsersSchema = require("../schemas/eventForUsers");
const checkValidation = require("../middlewares/checkValidation");

const router = express.Router();

router.get('/users/:id', ctrlWrapper(getUserEvents))

router.post('/users/:id', ...eventForUsersSchema, checkValidation, ctrlWrapper(validateDate), ctrlWrapper(addEvent))

router.post('/:userId/validateDate', ctrlWrapper(validateDate))


module.exports = router;
