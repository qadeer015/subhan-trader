const Contact = require('../models/Contact');

const contactController = {
    async showForm(req, res) {
        res.render('contact', { title: 'Contact Us' });
    },

    async submit(req, res) {
        const { name, email, message } = req.body;
        await Contact.create(name, email, message);
        req.flash('success', 'Your query submitted successfully.');
        res.json({ success: true });
    },

    async list(req, res) {
        const contacts = await Contact.getAll();
        console.log(contacts);
        res.render('admin/contact/index', { title: 'Contact Messages', contacts });
    },

    async delete(req, res) {
        const { id } = req.params;
        await Contact.delete(id);
        req.flash('success', 'Message deleted successfully.');
        res.redirect('/admin/contacts');
    }
};

module.exports = contactController;
