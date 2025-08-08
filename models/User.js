// === models/User.js ===
const db = require('../config/db');

const findByEmail = async (email) => {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return users[0];
};

const findByGoogleIdOrEmail = async (googleId, email) => {
  const [users] = await db.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email]);
  return users;
};

const createGoogleUser = async (profile) => {
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
};

const updateUserGoogleData = async (profile, userId) => {
  await db.query(
    'UPDATE users SET google_id = ?, profile_photo = ?, email_verified = TRUE WHERE id = ?',
    [profile.id, profile.photos[0].value, userId]
  );
};


module.exports = {
  findByEmail,
  findByGoogleIdOrEmail,
  createGoogleUser,
  updateUserGoogleData,
};