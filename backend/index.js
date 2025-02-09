import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'students_db'
});

db.connect(err => {
    if (err) {
        console.log('Failed to connect to the database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// Get all students
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, result) => {
        if (err) {
            console.log('Error getting students:', err);
            return res.status(500).json({ error: 'Failed to fetch students' });
        }
        res.json(result);
    });
});

// Add a new student
app.post('/students', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Please provide both name and email' });
    }
    db.query('INSERT INTO students (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) {
            console.log('Error adding student:', err);
            return res.status(500).json({ error: 'Failed to add student' });
        }
        res.json({ message: 'Student added successfully!' });
    });
});

// Update an existing student
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if ID exists in the database
    db.query('SELECT * FROM students WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log('Error finding student:', err);
            return res.status(500).json({ error: 'Failed to find student' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // If the student exists, update their details
        db.query('UPDATE students SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
            if (err) {
                console.log('Error updating student:', err);
                return res.status(500).json({ error: 'Failed to update student' });
            }
            res.json({ message: 'Student updated successfully!' });
        });
    });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;

    // Check if the student with the given ID exists
    db.query('SELECT * FROM students WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log('Error finding student:', err);
            return res.status(500).json({ error: 'Failed to find student' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // If the student exists, delete them
        db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
            if (err) {
                console.log('Error deleting student:', err);
                return res.status(500).json({ error: 'Failed to delete student' });
            }
            res.json({ message: 'Student deleted successfully!' });
        });
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
