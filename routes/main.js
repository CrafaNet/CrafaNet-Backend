var express = require("express");
var router = express.Router();
const app = express();
 

const userRouters = require("./user");
const videoRouters = require("./videos");
const shortVideoRouters = require("./shortVideos");


router.use("/user", userRouters)
router.use("/videos", videoRouters)
router.use("/shortVideos", shortVideoRouters)

module.exports = router;