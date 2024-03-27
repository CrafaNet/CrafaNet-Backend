const express = require("express")
const router = express.Router();

const userController = require("../controllers/user");
const redirect = require("../middlewares/redirect");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");



router.route("/create").post(userController.createUser);
router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(userController.logoutUser);
router.route("/sendUserInfo").post(userController.sendUserInfo);
router.route("/updateUserInfo").post(userController.updateUserInfo);
router.route("/sendConfirmCode").post(userController.sendConfirmCode);
router.route("/checkConfirmCode").post(userController.checkConfirmCode);
router.route("/sendResetPasswordCode").post(userController.sendResetPasswordCode);
router.route("/checkResetPasswordCode").post(userController.checkResetPasswordCode);
router.route("/userNotifications").post(auth, userController.userNotifications);
router.route("/sendAnouncmentNotification").post(auth, admin, userController.sendAnouncmentNotification);
router.route("/updateUserInfo").post(auth, userController.updateUserInfo);
router.route("/updatePhoneNumber").post(auth, userController.updatePhoneNumber);


module.exports = router;