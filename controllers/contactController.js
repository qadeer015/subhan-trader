const Contact = require('../models/Contact');

const contactController = {
    async showForm(req, res) {
        res.render('contact', { title: 'Contact Us' });
    },

    async submit(req, res) {
        const { name, email, message } = req.body;
        await Contact.create(name, email, message);
        res.json({ success: true, message:"Your query submitted successfully." });
    },

    async list(req, res) {
        const messages = await Contact.getAll();
        res.render('contact-messages', { title: 'Messages', messages });
    },

    async delete(req, res) {
        const { id } = req.params;
        await Contact.delete(id);
        res.redirect('/admin/messages');
    }
};

module.exports = contactController;
