const db = require("../config/db");

class Contact {
    static async create(name, email, message) {
        const [insertResult] = await db.execute(
            'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );

        const [rows] = await db.execute(
            'SELECT * FROM contacts WHERE id = ?',
            [insertResult.insertId]
        );

        return rows[0];
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
        return rows;
    }

    static async delete(id) {
        await db.execute('UPDATE contacts SET name = NULL, email = NULL, message = NULL WHERE id = ?', [id]);
        const result = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
        return result;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM contacts WHERE id = ?', [id]);
        return rows[0];
    }

    static async count() {
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM contacts');
        return rows[0].count;
    }
}

module.exports = Contact;
