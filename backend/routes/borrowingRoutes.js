
const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');

router.post('/borrow', borrowingController.borrowBook);
router.get('/borrowings/:userID', borrowingController.getUserBorrowings);
router.post('/unborrow', borrowingController.unborrowBook);


module.exports = router;
