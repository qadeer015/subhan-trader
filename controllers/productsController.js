const Product = require('../models/Product');
const Category = require('../models/Category');

const productController = {
    // productController.js
    async list(req, res) {
        try {
            let products = await Product.getAll();
            const categories = await Category.getAll();

            products = products.map(product => ({
                ...product,
                rating: parseFloat(product.rating).toFixed(1),
                price: parseFloat(product.price).toFixed(2)
            }));
            if (req.user && req.user.role === 'admin') {
                return res.render('admin/products/index', {
                    title: 'Products',
                    products,
                    categories,
                    success: req.flash('success'),
                    error: req.flash('error')
                });
            } else {
                res.render('products/index', {
                    title: 'Products',
                    products,
                    categories,
                    success: req.flash('success'),
                    error: req.flash('error')
                });
            }
        } catch (error) {
            console.error('Product list error:', error);  // Detailed error log
            req.flash('error', 'Failed to fetch products');
            res.redirect('/');
        }
    },

    async createForm(req, res) {
        const categories = await Category.getAll();
        res.render('admin/products/new', {
            title: 'Add New Product',
            categories
        });
    },

    async create(req, res) {
        try {
            const { name, description, price, category_id, condition, stock } = req.body;
            const image = req.file ? req.file.filename : null;

            if (!image) {
                throw new Error('Product image is required');
            }

            const newProduct = await Product.create(
                name,
                description,
                price,
                image,
                category_id,
                condition,
                stock
            );

            req.flash('success', 'Product created successfully');
            res.redirect(`/admin/products/${newProduct.id}`);
        } catch (error) {
            console.error('Create error:', error);
            req.flash('error', error.message || 'Failed to create product');
            res.redirect('/products/create/new');
        }
    },

    async show(req, res) {
        try {
            let product = await Product.getById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            product = {
                ...product,
                rating: parseFloat(product.rating).toFixed(1),
                price: parseFloat(product.price).toFixed(2)
            };
            if (req.user && req.user.role === 'admin') {
                res.render('admin/products/show', {
                    title: product.name,
                    product
                });
            } else {
                res.render('products/show', {
                    title: product.name,
                    product
                });
            }
        } catch (error) {
            req.flash('error', 'Failed to fetch product details');
            res.redirect('/products');
        }
    },

    async editForm(req, res) {
        try {
            const product = await Product.getById(req.params.id);
            const categories = await Category.getAll();
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }

            res.render('admin/products/edit', {
                title: `Edit ${product.name}`,
                product,
                categories
            });
        } catch (error) {
            req.flash('error', 'Failed to load edit form');
            res.redirect('/products');
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, category_id, condition, stock, existingImage } = req.body;
            const image = req.file ? req.file.filename : existingImage;
            if (!image) {
                throw new Error('Product image is required');
            }
            await Product.updateProduct(id, name, description, price, image, category_id, condition, stock);
            req.flash('success', 'Product updated successfully');
            res.redirect(`/admin/products/${id}`);
        } catch (error) {
            req.flash('error', 'Failed to update product');
            res.redirect(`/admin/products/${req.params.id}/edit`);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Product.delete(id);

            if (deleted) {
                req.flash('success', 'Product deleted successfully');
            } else {
                req.flash('error', 'Product not found');
            }
            res.redirect('/admin/products');
        } catch (error) {
            req.flash('error', 'Failed to delete product');
            res.redirect('/products');
        }
    },

    async listByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await Product.getByCategory(categoryId);
            const category = await Category.getById(categoryId);

            res.render('products/list', {
                title: `Products in ${category.name}`,
                products,
                currentCategory: categoryId
            });
        } catch (error) {
            req.flash('error', 'Failed to fetch products by category');
            res.redirect('/products');
        }
    }
};

module.exports = productController;