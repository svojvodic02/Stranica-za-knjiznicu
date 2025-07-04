const db = require('../config/db');

class Post {
  static async create(userId, comment) {
    const [result] = await db.execute(
      'INSERT INTO posts (userId, comment) VALUES (?, ?)',
      [userId, comment]
    );
    return result;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM posts WHERE userId = ?', [userId]);
    return rows;
  }
}

module.exports = Post;