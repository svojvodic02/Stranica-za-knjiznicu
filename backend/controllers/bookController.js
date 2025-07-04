const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');

const db = require('../config/db');

exports.getBooks = async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT books.*, users.username 
        FROM books 
        JOIN users ON books.userId = users.id 
        ORDER BY books.id DESC  
      `);
      console.log('Fetched posts:', rows);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.addBook = async (req, res) => {
    try {
   
      const {title,author,genreId,available, userId } = req.body;
       console.log({ title, author, genreId, available, userId });
      const [result] = await db.execute(
        'INSERT INTO books (title, author, genreId, available, userId) VALUES (?, ?, ?, ?, ?)',
        [title,author,genreId,available,userId]
      );
      res.status(201).json({ message: 'Books added successfully' });
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.updateBook = async (req, res) => {
    try {
      const { id } = req.params; 
      const { title, author, genreId, available, userId } = req.body;
      
      const [post] = await db.execute('SELECT userId FROM books WHERE id = ?', [id]);
      if (post.length === 0 || post[0].userId !== userId) {
        return res.status(403).json({ error: 'You can only edit your own books.' });
      }
  
      
      await db.execute(  'UPDATE books SET title = ?, author = ?, genreId = ?, available = ? WHERE id = ?',
  [title, author, genreId, available, id]);
  
      res.json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const [post] = await db.execute('SELECT userId FROM books WHERE id = ?', [id]);
    if (post.length === 0 || post[0].userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own books.' });
    }

    await db.execute('DELETE FROM books WHERE id = ?', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
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