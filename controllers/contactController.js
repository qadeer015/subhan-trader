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
        res.render('admin/contact/index', { title: 'Contacts', contacts, viewPage: 'contacts' });
    },

    async getTotal(){
        return await Contact.count();
    },

    async show(req, res) {
        const { id } = req.params;
        const contact = await Contact.getById(id);
        if (contact) {
            contact.created_at = formateDate(contact.created_at);
        }
        res.render('admin/contact/show', { title: 'Contact Message', contact,  viewPage: 'contacts-show'  });
    },

    async delete(req, res) {
        const { id } = req.params;
        await Contact.delete(id);
        req.flash('success', 'Message deleted successfully.');
        res.redirect('/admin/contacts');
    }
};


function formateDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]; // Month should be as Jan to Dec
    const year = d.getFullYear();
    const hours = d.getHours() % 12 || 12; //12-hour format
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM'; // Uncomment this line if using 12-hour format
    const minutes = d.getMinutes();
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`; // Include AM/PM if using 12-hour format
}



module.exports = contactController;
