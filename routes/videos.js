const express = require("express")
const router = express.Router();

const videos = require("../controllers/videos");
const redirect = require("../middlewares/redirect");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
 


router.route("/getUserSpecializedVideos").post(videos.getUserSpecializedVideos);
router.route("/getVideo").post(videos.getVideo); 
router.route("/getUserSpecializedCateory").post(videos.getUserSpecializedCateory);


module.exports = router;