
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var cors = require('cors')
const path = require('path');
const app = express();
const PORT = 3000;

const DAO = require('./dao.js');
app.use(express.json());

//DO ZMIANY PO DEBUGOWANIU
app.use(cors())

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        originalJson.call(this, data);
    };
    next();
});

app.use(express.static(path.join(__dirname, '../../frontend')));


//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
//});


app.post('/api/populate', async (req, res) => {
    try {
        DAO.populateDb();
        res.status(200).send('DB populated')
    } catch (error) {
        console.error('Error getting dates:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/api/dates', async (req, res) => {
    try {
        const dates = await DAO.getAllDates();
        res.json({ dates });
    } catch (err) {
        console.error('Error getting dates:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/dates', async (req, res) => {
    const { title, date } = req.body;
    if (!title || !date) {
        return res.status(400).json({ error: 'Missing title or date' });
    }

    try {
        const result = await DAO.insertDate(title, date);
        res.status(201).json({ id: result.id });
    } catch (err) {
        console.error('Error inserting date:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/dates/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await DAO.deleteDate(id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Date not found' });
        }
    } catch (err) {
        console.error('Error deleting date:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
