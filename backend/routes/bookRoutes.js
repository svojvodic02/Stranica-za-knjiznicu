const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/book', bookController.getBooks);
router.post('/book', bookController.addBook);
router.put('/book/:id', bookController.updateBook);
router.delete('/book/:id', bookController.deleteBook);

module.exports = router;