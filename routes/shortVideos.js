const express = require("express")
const router = express.Router();

const shortVideos = require("../controllers/shortVideos");
const redirect = require("../middlewares/redirect");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
 


router.route("/getUserSpecializedShortVideos").post(shortVideos.getUserSpecializedShortVideos); 
router.route("/likeShortVideos").post(shortVideos.likeShortVideos);
router.route("/clickGoToVideoInShortVideos").get(shortVideos.clickGoToVideoInShortVideos);
router.route("/saveShortVideo").get(shortVideos.saveShortVideo);

module.exports = router;