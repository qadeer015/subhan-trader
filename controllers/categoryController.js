const Category = require('../models/Category');

const categoryController = {
    async list(req, res) {
        const categories = await Category.getAll();
        res.render('categories', { title: 'Categories', categories });
    },

    async create(req, res) {
        const { name } = req.body;
        await Category.create(name);
        res.redirect('/categories');
    },

    async delete(req, res) {
        const { id } = req.params;
        await Category.delete(id);
        res.redirect('/categories');
    }
};

module.exports = categoryController;
