const Product = require('../models/Product');
const Category = require('../models/Category');

const productController = {
    // productController.js
async list(req, res) {
    try {
        console.log('Fetching products...');  // Debug log
        const products = await Product.getAll();
        const categories = await Category.getAll();
        console.log('Products fetched:', products.length);  // Debug log
        res.render('products/index', { 
            title: 'All Products', 
            products, 
            categories,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Product list error:', error);  // Detailed error log
        req.flash('error', 'Failed to fetch products');
        res.redirect('/');
    }
},

    async createForm(req, res) {
        const categories = await Category.getAll();
        res.render('products/create', { 
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
            res.redirect(`/products/${newProduct.id}`);
        } catch (error) {
            console.error('Create error:', error);
            req.flash('error', error.message || 'Failed to create product');
            res.redirect('/products/create/new');
        }
    },

    async show(req, res) {
        try {
            const product = await Product.getById(req.params.id);
            if (!product) {
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            console.log(product)
            res.render('products/show', { 
                title: product.name, 
                product 
            });
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

            res.render('products/edit', { 
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
            const { name, description, price, category_id, condition, stock, rating } = req.body;
            const image = req.file ? req.file.filename : req.body.existingImage;

            await Product.update(id, {
                name,
                description,
                price,
                image,
                category_id,
                condition,
                stock,
                rating
            });

            req.flash('success', 'Product updated successfully');
            res.redirect(`/products/${id}`);
        } catch (error) {
            req.flash('error', 'Failed to update product');
            res.redirect(`/products/${req.params.id}/edit`);
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
            res.redirect('/products');
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