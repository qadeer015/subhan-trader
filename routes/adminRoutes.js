const express = require("express");
const router = express.Router();
const { isAuthenticated,isAdmin} = require("../middlewares/authenticate");
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", async (req, res)=>{
      res.send("hello admin");
})

module.exports = router;