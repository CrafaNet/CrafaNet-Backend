const express = require("express")
const router = express.Router();

const comunityController = require("../controllers/comunity");
const redirect = require("../middlewares/redirect");
const auth = require("../middlewares/auth");
 


router.route("/userSpecializedCommunities").post(auth, comunityController.userSpecializedCommunities);
router.route("/listAllComunities").post(comunityController.listAllComunities);
router.route("/createComunity").post(comunityController.createComunity);
router.route("/updateComunity/:id").put(auth, comunityController.updateComunity);
router.route("/payRegistrationFee/:id").post(comunityController.payRegistrationFee);
router.route("/listOfCategories").post(comunityController.listOfCategories);
router.route("/joinComunity").post(comunityController.joinComunity);
router.route("/comunityDetail").post(comunityController.comunityDetail);
router.route("/comunityMembers").post(comunityController.comunityMembers);
router.route("/comunityVideos").post(comunityController.comunityVideos);
router.route("/addNewVideo").post(comunityController.addNewVideo);
router.route("/updateVideo").put(comunityController.updateVideo);
router.route("/changeStatusVideo").delete(comunityController.changeStatusVideo);
router.route("/addCommentInVideo").post(comunityController.addCommentInVideo);
router.route("/deleteCommentInVideo").post(comunityController.deleteCommentInVideo);
router.route("/addAnswerInComment").post(comunityController.addAnswerInComment);
router.route("/deleteAnswerInComment").post(comunityController.deleteAnswerInComment); 
router.route("/leaveComunity").post(comunityController.leaveComunity);

module.exports = router;