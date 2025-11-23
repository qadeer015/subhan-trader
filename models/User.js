// models/User.js
const db = require('../config/db');
class User {
  static async findByEmail(email) {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  }

  static async findByGoogleIdOrEmail(googleId, email) {
    const [users] = await db.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email]);
    return users;
  }


  static async createGoogleUser(profile) {
    const [result] = await db.query(
      'INSERT INTO users (google_id, name, email, profile_photo, email_verified) VALUES (?, ?, ?, ?, ?)',
      [
        profile.id,
        profile.displayName,
        profile.emails[0].value,
        profile.photos[0].value,
        true
      ]
    );
    return { id: result.insertId, ...profile };
  }

  static async updateUserGoogleData(profile, userId) {
    await db.query(
      'UPDATE users SET google_id = ?, profile_photo = ?, email_verified = TRUE WHERE id = ?',
      [profile.id, profile.photos[0].value, userId]
    );
  }

  static async getAll(role='customer') {
    const [rows] = await db.execute('SELECT * FROM users WHERE role = ?', [role]);
    return rows;
  }

  static async count(role='customer') {
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE role = ?', [role]);
    return rows[0].count;
  }

}

module.exports = User;