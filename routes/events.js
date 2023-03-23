const express = require('express');
const addEvent = require("../controllers/events/addEvent");
const ctrlWrapper = require("../middlewares/ctrlWrapper");
const getUserEvents = require("../controllers/events/getUserEvents");

const router = express.Router();

router.get('/users/:id', ctrlWrapper(getUserEvents))

router.post('/users/:id', ctrlWrapper(addEvent))


module.exports = router;
