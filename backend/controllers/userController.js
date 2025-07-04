const db = require('../config/db');

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  if (!username || !email) return res.status(400).json({ error: 'Missing fields' });

  try {
    await db.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM user_roles WHERE userId = ?', [id]);
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, username, email, name FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
