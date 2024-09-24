// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

const signup = (req, res) => {
  const { username, password, role } = req.body; // role: 'customer' or 'merchant'
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO Users (username, password, role) VALUES (?, ?, ?)`;
  connection.query(query, [username, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ message: 'User created successfully' });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM Users WHERE username = ?`;
  connection.query(query, [username], (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    if (results.length === 0) return res.status(404).send({ message: 'User not found' });

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) return res.status(401).send({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).send({ token });
  });
};

module.exports = { signup, login };
