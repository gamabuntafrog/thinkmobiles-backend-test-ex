const express = require('express');
const addEvent = require("../controllers/events/addEvent");
const deleteEvent = require("../controllers/events/deleteEvent");
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

router.delete('/:eventId/users/:userId', ctrlWrapper(auth), ctrlWrapper(deleteEvent))


module.exports = router;
