const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

const DatesDAO = {
    populateDb: () => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS dates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                date TEXT NOT NULL
              )`);

            db.run(`INSERT INTO dates (title, date) VALUES (?, ?)`, ['Strzy¿enie mêskie', '2025-05-01']);
            db.run(`INSERT INTO dates (title, date) VALUES (?, ?)`, ['Strzy¿enie damskie', '2025-06-15']);
            db.run(`INSERT INTO dates (title, date) VALUES (?, ?)`, ['Strzy¿enie mêski', '2025-07-30']);
        });
    },

    getAllDates: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM dates', [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    insertDate: (title, date) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO dates (title, date) VALUES (?, ?)';
            db.run(query, [title, date], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    },

    deleteDate: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM dates WHERE id = ?';
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }
};

module.exports = DatesDAO;
