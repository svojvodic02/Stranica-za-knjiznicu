const db = require('../config/db');

class Book {
  static async create(title,author,	genreId,available,userId) {
    const [result] = await db.execute(
      'INSERT INTO books (title,author,	genreId,available,userId) VALUES (?, ?,?,?,?)',
      [title,author,parseInt(genreId),available,userId]
    );
    return result;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM books WHERE userId = ?', [userId]);
    return rows;
  }
}

module.exports = Book;