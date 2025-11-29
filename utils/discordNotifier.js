// utils/discordNotifier.js
const axios = require('axios');
const Setting = require('../models/Setting');

async function sendDiscordMessage(type, messageData) {
  // Decide webhook key and embed details based on type
  let key, embed;
  switch (type) {
    case 'notification_endpoint':
      key = 'notification_endpoint';
      embed = {
        title: "New Contact Message Received",
        description: `**Name**: ${messageData.name}\n**Email**: ${messageData.email}\n**Message**: ${messageData.message}\n**Contact Number**: ${messageData.contact_no}\n\n <a href='https://ibctank.store/admin/contacts/${messageData.id}'>View Message</a>`,
        color: 0x4F46E5,
        footer: { text: "ibctank.store" },
        timestamp: new Date()
      };
      break;
    default:
      console.warn(`⚠️ Unknown message type: ${type}`);
      return;
  }

  // Fetch webhook URL from DB
  const setting = await Setting.findByKey(key);

  if (!setting || !setting.value) {
    console.warn(`⚠️ No Discord webhook set for ${key}`);
    return;
  }

  // Send embed message
  try {
    await axios.post(setting.value, {
      username: "Contacts Notifier",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png", // you can change this avatar
      embeds: [embed],
    });
  } catch (err) {
    console.error("❌ Discord message failed:", err.message);
  }
}

module.exports = sendDiscordMessage;
