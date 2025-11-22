const db = require("./config/db");

async function addContactNoColumn() {
    try {

         const contacts =  await db.execute(`
            select * from contacts
        `);
        console.log(contacts);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding column:", error);
        process.exit(1);
    }
}

addContactNoColumn();
