import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);  // Track the student being edited

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const addStudent = async () => {
        if (!name || !email) return alert('Please fill in all fields');
        try {
            await axios.post('http://localhost:5000/students', { name, email });
            setName('');
            setEmail('');
            fetchStudents(); // Refresh list
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const deleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/students/${id}`);
            fetchStudents(); // Refresh list after deletion
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const startEditing = (student) => {
        setEditingStudent(student); // Set student to be edited
        setName(student.name);  // Pre-fill input fields with current data
        setEmail(student.email);
    };

    const saveChanges = async () => {
        if (!name || !email) return alert('Please fill in all fields');
        try {
            await axios.put(`http://localhost:5000/students/${editingStudent.id}`, { name, email });
            setEditingStudent(null); // Clear editing state
            setName('');
            setEmail('');
            fetchStudents(); // Refresh list
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    return (
        <div>
            <h2>Student List</h2>
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={editingStudent ? saveChanges : addStudent}>
                {editingStudent ? 'Save Changes' : 'Add Student'}
            </button>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => startEditing(student)}>Edit</button>
                                <button onClick={() => deleteStudent(student.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;
