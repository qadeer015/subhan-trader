// models/Setting.js
const db = require('../config/db');

class Setting {
  static async all() {
    const [rows] = await db.execute('SELECT * FROM settings');
    return rows;
  }

  static async findByKey(key) {
    const [rows] = await db.execute('SELECT * FROM settings WHERE `key` = ?', [key]);
    return rows[0];
  }

  static async upsert(key, value) {
    // MySQL UPSERT (insert or update if key exists)
    const query = `
      INSERT INTO settings (\`key\`, \`value\`)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`);
    `;
    await db.execute(query, [key, value]);
  }
}

module.exports = Setting;