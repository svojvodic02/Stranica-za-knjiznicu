const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const db = require('../config/db');

exports.getPosts = async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.userId = users.id 
        ORDER BY posts.timestamp DESC
      `);
      console.log('Fetched posts:', rows);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.addPost = async (req, res) => {
    try {
      const { userId, comment, timestamp } = req.body;
      const [result] = await db.execute(
        'INSERT INTO posts (userId, comment, timestamp) VALUES (?, ?, ?)',
        [userId, comment, timestamp]
      );
      res.status(201).json({ message: 'Post added successfully' });
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.updatePost = async (req, res) => {
    try {
      const { id } = req.params; 
      const { comment, userId } = req.body; 
      
      const [post] = await db.execute('SELECT userId FROM posts WHERE id = ?', [id]);
      if (post.length === 0 || post[0].userId !== userId) {
        return res.status(403).json({ error: 'You can only edit your own posts.' });
      }
  
      
      await db.execute('UPDATE posts SET comment = ? WHERE id = ?', [comment, id]);
  
      res.json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      await db.execute('DELETE FROM posts WHERE id = ?', [id]);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    await User.create(username, password, name, email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};