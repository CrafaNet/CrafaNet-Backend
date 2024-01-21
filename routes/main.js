var express = require("express");
var router = express.Router();
const app = express();
 

const pageRouters = require("./page");
const comunityRouters = require("./comunity");
const userRouters = require("./user");




router.use("/", pageRouters)
router.use("/user", userRouters)
router.use("/comunity", comunityRouters)

module.exports = router;