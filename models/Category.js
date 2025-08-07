const db = require("../config/db");

class Category {
    static async create(name) {
        const [insertResult] = await db.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );

        const [rows] = await db.execute(
            'SELECT * FROM categories WHERE id = ?',
            [insertResult.insertId]
        );

        return rows[0];
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
        return rows;
    }

    static async delete(id) {
        const result = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
        return result;
    }
}

module.exports = Category;
