const Category = require('../models/Category');

const categoryController = {
    async list(req, res) {
        const categories = await Category.getAll();
        res.render('admin/category/index', { title: 'Categories', categories, viewPage: 'categories' });
    },

    async create(req, res) {
        const { name } = req.body;
        await Category.create(name);
        req.flash('success', 'Category created successfully.');
        res.redirect('/admin/categories');
    },

    async delete(req, res) {
        const { id } = req.params;
        await Category.delete(id);
        req.flash('success', 'Category deleted successfully.');
        res.redirect('/categories');
    }
};

module.exports = categoryController;
