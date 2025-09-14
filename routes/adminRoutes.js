const express = require("express");
const { isAuthenticated,isAdmin} = require("../middlewares/authenticate");
const Product = require("../models/Product");
const User = require("../models/User");
const productController = require('../controllers/productsController');
const contactController = require('../controllers/contactController');
const categoryController = require('../controllers/categoryController');
const upload = require("../middlewares/upload");
const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", async (req, res)=>{
      try{
            let totalProducts = await Product.count();
            let totalCustomers = await User.count('customer');
            let totalContacts = await contactController.getTotal();
            res.render("admin/dashboard", {totalProducts, totalCustomers, totalContacts, title:'Dashboard'});
      }catch(error){
          console.log(error);
      }
})

// Products
router.get("/products", productController.list);
router.get("/products/new", productController.createForm);
router.post("/products/create",upload.single('image'), productController.create);
router.get("/products/:id", productController.show);
router.get("/products/:id/edit", productController.editForm);
router.post("/products/:id/update",upload.single('image'), productController.update);
router.post("/products/:id/delete", productController.delete);


// Contacts
router.get('/contacts', contactController.list);
router.post('/contacts/:id/delete', contactController.delete);

// Categories
router.get('/categories', categoryController.list);
router.post('/categories/create', categoryController.create);
router.post('/categories/:id/delete', categoryController.delete);

// Customers
router.get('/customers', async (req, res)=>{
      try{
            let customers = await User.getAll('customer');
            res.render("admin/customer/index", {customers, title:'Customers'});
      }catch(error){
          console.log(error);
      }
});

module.exports = router;