// ==utils/templateRenderer.js==
const fs = require("fs");
const path = require("path");

/**
 * Load an HTML template and replace {{placeholders}}
 * @param {string} fileName - template file name
 * @param {object} variables - key/value replacements
 */
const renderTemplate = (fileName, variables = {}) => {
  const filePath = path.join(__dirname, "..", "templates", "email", fileName);
  let html = fs.readFileSync(filePath, "utf8");

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  }

  return html;
};

module.exports = renderTemplate;
