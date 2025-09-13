const express = require("express");
const { isAuthenticated,isAdmin} = require("../middlewares/authenticate");
const Product = require("../models/Product");
const User = require("../models/User");
const productController = require('../controllers/productsController');
const upload = require("../middlewares/upload");
const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", async (req, res)=>{
      try{
            let products = await Product.getAll();
            let customers = await User.getAll('admin');
            res.render("admin/dashboard", {products, customers, title:'Dashboard'});
      }catch(error){
          console.log(error);
      }
})

router.get("/products", productController.list);
router.get("/products/new", productController.createForm);
router.post("/products/create",upload.single('image'), productController.create);
router.get("/products/:id", productController.show);
router.get("/products/:id/edit", productController.editForm);
router.post("/products/:id/update",upload.single('image'), productController.update);
router.post("/products/:id/delete", productController.delete);



module.exports = router;