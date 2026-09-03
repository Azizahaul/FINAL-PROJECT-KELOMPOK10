// routes/schedule.routes.js
const express = require('express');
const router = express.Router();
router.get('/search', scheduleController.searchSchedules);

const scheduleController = require('../controllers/schedule.controller');

router.get('/', scheduleController.getAllSchedules);
router.post('/', scheduleController.createSchedule);

module.exports = router;