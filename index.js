// index.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // localhost
  user: process.env.DB_USER,     // root
  password: process.env.DB_PASS, // your MySQL password
  database: process.env.DB_NAME  // your DB name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname)); // Serves form.html if in same folder

// Route: serve form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// ✅ Route: handle form submission
app.post('/submit', (req, res) => {
  const { name, marks, grade, city } = req.body;

  const query = 'INSERT INTO student_info (name, marks, grade, city) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, marks, grade, city], (err, result) => {
    if (err) {
      console.error('❌ DB insert error:', err);
      res.send('Error saving to DB. ' + err.sqlMessage);
    } else {
      console.log('✅ Inserted:', { name, marks, grade, city });
      res.send('Form submitted successfully!');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});