const express = require("express")
const router = express.Router();

const pageController = require("../controllers/page");
const redirect = require("../middlewares/redirect");
const auth = require("../middlewares/auth");
 


// router.route("/register").post(pageController.createUser); 


module.exports = router;