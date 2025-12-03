// controllers/settingsController.js
const Setting = require("../models/Setting");

exports.getSettingsPage = async (req, res) => {
  try {
    const settingsArray = await Setting.all();
    const settings = {};

    settingsArray.forEach((s) => {
      try {
        settings[s.key] = JSON.parse(s.value);
      } catch {
        settings[s.key] = s.value;
      }
    });

    res.render("admin/settings", { settings, title: "Settings", viewPage: 'settings' });
  } catch (err) {
    console.error("Error loading settings:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.saveSettings = async (req, res) => {
  try {
    // Get old settings first
    const oldSettingsArray = await Setting.all();
    const oldSettings = {};
    oldSettingsArray.forEach((s) => {
      try {
        oldSettings[s.key] = JSON.parse(s.value);
      } catch {
        oldSettings[s.key] = s.value;
      }
    });

    const {
      notify_contact_submission,
      notification_method,
      notification_endpoint
    } = req.body;

    const allSettings = {
      notify_contact_submission: !!notify_contact_submission,
      notification_method,
      notification_endpoint
    };
    
    for (const [key, value] of Object.entries(allSettings)) {
      await Setting.upsert(key, value);
    }

    res.redirect("/admin/settings");
  } catch (err) {
    console.error("Error saving settings:", err);
    res.redirect("/admin/settings");
  }
};
