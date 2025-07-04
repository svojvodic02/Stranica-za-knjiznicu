const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', async (req, res) => {
  try {
    const [genres] = await db.execute('SELECT * FROM genres');
    res.json(genres);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Genre name is required' });
  }

  try {
    await db.execute('INSERT INTO genres (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Genre added' });
  } catch (err) {
    console.error('Error adding genre:', err);
    res.status(500).json({ error: 'Failed to add genre' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await db.execute('UPDATE genres SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Genre updated' });
  } catch (err) {
    console.error('Error updating genre:', err);
    res.status(500).json({ error: 'Failed to update genre' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM genres WHERE id = ?', [id]);
    res.json({ message: 'Genre deleted' });
  } catch (err) {
    console.error('Error deleting genre:', err);
    res.status(500).json({ error: 'Failed to delete genre' });
  }
});

module.exports = router;