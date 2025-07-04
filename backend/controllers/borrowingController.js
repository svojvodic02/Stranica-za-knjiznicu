
const db = require('../config/db');

exports.borrowBook = async (req, res) => {
  const { bookID, userID } = req.body;

  try {
    const [bookRows] = await db.execute('SELECT available FROM books WHERE id = ?', [bookID]);
    if (bookRows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (!bookRows[0].available) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    await db.execute('UPDATE books SET available = 0 WHERE id = ?', [bookID]);
    await db.execute('INSERT INTO borrowings (bookID, userID, borrowDate) VALUES (?, ?, NOW())', [bookID, userID]);

    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserBorrowings = async (req, res) => {
  const { userID } = req.params;
  try {
    const [rows] = await db.execute(`
      SELECT b.*, bo.borrowDate, bo.returnDate
      FROM books b
      JOIN borrowings bo ON b.id = bo.bookID
      WHERE bo.userID = ? AND bo.returnDate IS NULL
    `, [userID]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.unborrowBook = async (req, res) => {
  const { bookID, userID } = req.body;

  if (typeof bookID === 'undefined' || typeof userID === 'undefined') {
    return res.status(400).json({ error: 'Missing bookID or userID in request body' });
  }

  try {
    await db.execute('DELETE FROM borrowings WHERE bookID = ? AND userID = ?', [bookID, userID]);

    await db.execute('UPDATE books SET available = 1 WHERE id = ?', [bookID]);

    res.json({ message: 'Book unborrowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
