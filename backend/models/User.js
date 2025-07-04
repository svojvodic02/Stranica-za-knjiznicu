const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(username, password, name, email) {
      const [result] = await db.execute(
        'INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
        [username, password, name, email] 
      );
      return result;
    }
  
    static async findByUsername(username) {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0]; 
    }

    static async assignRole(userId, isAdmin = false) {
    const [result] = await db.execute(
        'INSERT INTO user_roles (userId, isAdmin) VALUES (?, ?)',
        [userId, isAdmin]
      );
      return result;
    } 

  }
  
  module.exports = User;