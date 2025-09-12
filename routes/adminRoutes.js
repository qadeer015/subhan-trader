const express = require("express");
const { isAuthenticated,isAdmin} = require("../middlewares/authenticate");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", async (req, res)=>{
      try{
            let products = await Product.getAll();
            let customers = await User.getAll('admin');

            console.log("products : ", products);
            console.log("customers : ", customers);
            res.render("admin/dashboard", {products, customers, title:'Dashboard'});
      }catch(error){
          console.log(error);
      }
})

module.exports = router;