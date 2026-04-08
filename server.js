const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Дозволяємо серверу читати JSON з тіла запиту
app.use(express.json());

// Підключення до нашої бази даних SQLite
const db = new sqlite3.Database('./pizzeria.db', (err) => {
    if (err) console.error(err.message);
    console.log('Підключено до бази даних піцерії.');
});

// GET - отримати всі піци з меню (READ)
app.get('/pizzas', (req, res) => {
    db.all('SELECT * FROM pizzas', [], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.listen(3000, () => console.log('Сервер запущено на порту 3000'));
// POST - додати нового клієнта (CREATE)
app.post('/clients', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    db.run('INSERT INTO clients (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)',
        [first_name, last_name, phone, email], function (err) {
            if (err) throw err;
            res.json({ message: 'Клієнта успішно додано', id: this.lastID });
        });
});

// PUT - оновити дані клієнта (UPDATE)
app.put('/clients/:id', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    const { id } = req.params;
    db.run('UPDATE clients SET first_name=?, last_name=?, phone=?, email=? WHERE client_id=?',
        [first_name, last_name, phone, email, id], function (err) {
            if (err) throw err;
            res.json({ message: 'Дані клієнта оновлено' });
        });
});

// DELETE - видалити клієнта (DELETE)
app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM clients WHERE client_id=?', [id], function (err) {
        if (err) throw err;
        res.json({ message: 'Клієнта видалено з бази' });
    });
});