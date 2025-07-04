const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    try {
      const { username, password, name, email } = req.body;

      const result = await User.create(username, password, name, email);
      const userId = result.insertId;

      await User.assignRole(userId, false);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (password !== user.password) { 
        return res.status(401).json({ error: 'Invalid password' });
      }

      const [adminRows] = await db.execute('SELECT isAdmin FROM user_roles WHERE userId = ?', [user.id]);
      const isAdmin = adminRows.length > 0 ? adminRows[0].isAdmin === 1 : false;

      const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

      res.json({ token, username: user.username, userId: user.id, isAdmin  });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };