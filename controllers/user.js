const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require("../models/User");
const Notification = require("../models/materials/Notification");

const sendSms = require('../functions/sendSms').sendSMS;

// Kullanıcı kayıt olma işlemi 
exports.registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ phone: req.body.data.phone });
        if (existingUser) {
            const response = {
                status: 201,
                message: "message_register_201"
            };
            return res.json(response);
        }

        const user = await User.create({
            ...req.body.data
        });

        // Kullanıcının şifresini bcrypt ile şifrele
        bcrypt.hash(req.body.data.password, 10).then(function (hash) {
            user.password = hash
        });

        const preToken = user.phone
        const hashToken = await bcrypt.hash(preToken, 10);
        user.token = hashToken
        user.registerDate = Date.now()
        await user.save()

        // SMS gönderme işlemi kullanıcıya kodu diğer fonksiyonda doğrulayacak eğer doğrulama işlemi başarılı olursa hesabı aktif olacak, değilse bu şekilde kalacak
        user.confirmCodeSendDate = Date.now()
        user.confirmCode = await Math.floor(Math.random() * 1000000)
        await user.save()
        await sendSms(user.phone, "Kayıt işleminizin başarılı olması için doğrulama kodunuz: " + user.confirmCode + " Geçerlilik süresi 10 dakikadır. Doğrulama kodunuzu kimseyle paylaşmayınız.")

        const response = {
            status: 200,
            data: user,
            message: "message_register_200"
        };
        return res.json(response);
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "message_register_500",
        };;
        return res.json(response);
    }
};


// Kullanıcının hesabını doğrulaması
exports.confirmUser = async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.body.data.phone });
        if (user.confirm) { // Eğer kullanıcı zaten doğrulanmışsa
            const response = {
                status: 202,
                message: "message_confirmUser_202"
            };
            return res.json(response);
        }
        if (user.confirmCode == req.body.data.confirmCode) {
            if (user.confirmCodeSendDate + 600000 < Date.now()) { // 10 dakikadan fazla süre geçmişse
                const response = {
                    status: 203,
                    message: "message_confirmUser_203"
                };
                return res.json(response);
            }
            user.confirm = true
            user.confirmCode = ""
            await user.save()
            const response = {
                status: 200,
                message: "message_confirmUser_200"
            };
            return res.json(response);
        } else {
            const response = {
                status: 201,
                message: "message_confirmUser_201"
            };
            return res.json(response);
        }
    }
    catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "message_confirmUser_500"
        };
        return res.json(response);
    }
}


// Kullanıcı giriş işlemi
exports.loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body.data;
        if (!phone || !password) {
            const response = {
                status: 201,
                message: "message_login_201"
            };
            return res.json(response);
        }
        const user = await User.findOne({ phone: phone }).select('token password phone confirm')
        if (user) {
            // Kullanıcının şifresini bcrypt ile karşılaştır
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                async function hashToken(req, user) {
                    const preToken = user.phone
                    const hashToken = await bcrypt.hash(preToken, 10);
                    user.token = hashToken
                    await user.save()
                }
                await hashToken(req, user)
                console.log(user)
                const response = {
                    status: 200,
                    data: { token: user.token },
                    message: "message_login_200"
                };
                return res.json(response);
            } else {
                const response = {
                    status: 202,
                    message: "message_login_202"
                };
                return res.json(response);
            }
        } else {
            const response = {
                status: 203,
                message: "message_login_203"
            };
            return res.json(response);
        }
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            eror: error,
            message: "message_login_500"
        };
        return res.json(response);
    }
};

// Kullanıcı çıkış işlemi
exports.logoutUser = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.data.token })
        user.token = ""
        user.save()
        const response = {
            status: 200,
            message: "message_logout_200"
        };
        return res.json(response);
    } catch (error) {
        const response = {
            status: 500,
            message: "message_logout_500"
        };
        return res.json(response);
    }
};

// Kullanıcı bilgilerini getirme işlemi
exports.sendUserInfo = async (req, res) => {
    const user = await User.findOne({ token: req.body.data.token })
    const response = {
        status: 200,
        data: user,
        message: "message_sendUserInfo_200"
    };
    return res.json(response);
}

// Kullanıcı bilgilerini güncelleme işlemi
exports.updateUserInfo = async (req, res) => {
    const user = await User.findOneAndUpdate({ token: req.body.data.token }, { ...req.body.data }, { new: true })
    const response = {
        status: 200,
        data: user,
        message: "message_updateUserInfo_200"
    };
    return res.json(response);
};


// Kullanıcı şifre yenileme kodu gönderme işlemi
exports.sendResetPasswordCode = async (req, res) => {
    const user = await User.findOne({ phone: req.body.data.phone });
    if (user) {
        if (user.resetPasswordCodeSendDate + 600000 > Date.now()) { // 10 dakikadan az süre geçmişse
            return res.status(202).json({
                status: 202,
                message: "message_sendResetPasswordCode_202"
            });
        }
        user.resetPasswordCode = Math.floor(Math.random() * 10000);
        await user.save()
        // SMS gönderme işlemi kullanıcıya

        return res.status(200).json({
            status: 200,
            data: { token: user.token },
            message: "message_sendResetPasswordCode_200"
        });
    } else {
        const response = {
            status: 201,
            message: "message_sendResetPasswordCode_201"
        };
        return res.json(response);
    }
}

// Kullanıcı şifre yenileme işlemi
exports.checkResetPasswordCode = async (req, res) => {
    const user = await User.findOne({ phone: req.body.data.phone });
    if (user) {
        if (user.resetPasswordCode == req.body.data.resetPasswordCode) {
            bcrypt.hash(req.body.data.newPassword, 10).then(function (hash) {
                user.password = hash
                user.save();
            });
            const response = {
                status: 200,
                message: "message_checkResetPasswordCode_200"
            };
            return res.json(response);
        } else {
            const response = {
                status: 201,
                message: "message_checkResetPasswordCode_201"
            };
            return res.json(response);
        }
    }
    const response = {
        status: 500,
        data: { token: user.token },
        message: "message_checkResetPasswordCode_500"
    };
    return res.json(response);
}

exports.userNotifications = async (req, res) => { // Kullanıcının bildirimlerini getirme işlemi
    const user = await User.findOne({ token: req.body.data.token }).populate('notifications')
    const notifications = user.notifications
    const response = {
        status: 200,
        data: notifications,
        message: "message_userNotifications_200"
    };
    return res.json(response);
}


// Yönetici tarafından tüm kullanıcılara bildirim gönderme işlemi (kullanıcının diline göre bildirim gönderme işlemi yapılıyor)
exports.sendAnouncmentNotification = async (req, res) => {
    const user = await User.find();
    const notification = await Notification.create({
        ...req.body.data
    });
    notification.type = "announcement"
    await notification.save()
    user.forEach(async (element) => {
        element.notifications.push(notification._id)
        await element.save()
    });
    const response = {
        status: 200,
        message: "message_sendNotification_200"
    };
    return res.json(response);
}


exports.updateUserInfo = async (req, res) => {
    const user = await User.findOneAndUpdate({ token: req.body.data.token }, { ...req.body.data }, { new: true })
    const response = {
        status: 200,
        data: user,
        message: "message_updateUserInfo_200"
    };
    return res.json(response);
}

exports.updatePhoneNumber = async (req, res) => {
    const user = await User.findOne({ token: req.body.data.token })
    const confirmCode = Math.floor(Math.random() * 10000)
    user.confirmCode = confirmCode
    if (user.confirmCodeSendDate + 120000 > Date.now()) { // 2 dakikadan az süre geçmişse
        return res.status(202).json({
            status: 202,
            message: "message_sendConfirmCode_202"
        });
    }
    user.confirmCodeSendDate = Date.now()
    await user.save()

    // SMS gönderme işlemi kullanıcıya
    console.log('sms api daha bağlanmadı db ye kaydedildi.')

    if (user.confirmCode == req.body.data.confirmCode) {
        user.phone = req.body.data.phone
        user.save()
        const response = {
            status: 200,
            message: "message_updatePhoneNumber_200"
        };
        return res.json(response);
    } else {
        const response = {
            status: 201,
            message: "message_updatePhoneNumber_201"
        };
        return res.json(response);
    }
}

exports.promoSms = async (req, res) => { // Tüm kullanıcılara tanıtım mesajı gönderme işlemi
    try {
        const user = await User.find();
        user.forEach(async (element) => {
            sendSms(element.phone, req.body.data.message)
        });
        const response = {
            status: 200,
            message: "message_promoSms_200"
        };
        return res.json(response);
    } catch (err) {
        console.log(err)
        const response = {
            status: 500,
            message: "message_promoSms_500"
        };
        return res.json(response);
    }
}