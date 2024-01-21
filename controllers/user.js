const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const User = require("../models/User");


// Kullanıcı kayıt olma işlemi
exports.createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ phone: req.body.data.phone });
        if (existingUser) {
            const response = {
                status: 201
            };
            return res.json(response);
        }

        const user = await User.create({
            ...req.body.data
        });

        user.profilImg[0] = ''

        // Kullanıcının şifresini bcrypt ile şifrele
        bcrypt.hash(req.body.data.password, 10).then(function (hash) {
            user.password = hash
        });

        const preToken = user.email
        const hashToken = await bcrypt.hash(preToken, 10);
        user.token = hashToken
        user.registerDate = Date.now()
        await user.save()

        const response = {
            status: 200,
            user
        };
        return res.json(response);
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
        };
        return res.json(response);
    }
};

// Kullanıcı giriş işlemi
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body.data;
        if (!phone || !password) {
            const response = {
                status: 201,
            };
            return res.json(response);
        }
        const user = await User.findOne({ email: email }).exec();
        if (user) {
            // Kullanıcının şifresini bcrypt ile karşılaştır
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                async function hashToken(req, user) {
                    const preToken = user.email
                    const hashToken = await bcrypt.hash(preToken, 10);
                    user.token = hashToken
                    await user.save()
                }
                await hashToken(req, user)
                const response = {
                    status: 200,
                    user: user
                };
                return res.json(response);
            } else {
                const response = {
                    status: 202,
                };
                return res.json(response);
            }
        } else {
            const response = {
                status: 203,
            };
            return res.json(response);
        }
    } catch (error) {
        const response = {
            status: 500,
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
        };
        return res.json(response);
    } catch (error) {
        const response = {
            status: 500,
        };
        return res.json(response);
    }
};

// Kullanıcı bilgilerini getirme işlemi
exports.sendUserInfo = async (req, res) => {
    const user = await User.findOne({ token: req.body.data.token })
    const response = {
        status: 200,
        user: user
    };
    return res.json(response);
}

// Kullanıcı bilgilerini güncelleme işlemi
exports.updateUserInfo = async (req, res) => {
    const user = await User.findOneAndUpdate({ token: req.body.data.token }, { ...req.body.data }, { new: true })
    const response = {
        status: 200,
        user: user
    };
    return res.json(response);
};

// Kullanıcı doğrulama kodu gönderme işlemi
exports.sendConfirmCode = async (req, res) => {
    const user = await User.findOne({ phone: req.body.data.phone });
    if (user) {
        if (user.confirmCodeSendDate + 120000 > Date.now()) { // 2 dakikadan az süre geçmişse
            return res.status(202).json({
                status: 202,
            });
        }
        user.confirmCode = Math.floor(Math.random() * 10000);
        user.confirmCodeSendDate = Date.now()
        await user.save()

        // SMS gönderme işlemi kullanıcıya

        res.status(200).json({
            status: 200,
            user: user
        });
    } else {
        res.status(201).json({
            status: 201,
        });
    }
}

// Kullanıcı doğrulama kodunu kontrol etme işlemi
exports.checkConfirmCode = async (req, res) => {
    const user = await User.findOne({ phone: req.body.data.phone });
    if (req.body.data.confirmCode == user.confirmCode) {
        user.confirm = true
        user.confirmCode = ""
        await user.save()
        const response = {
            status: 200,
        };
        return res.json(response);
    } else {
        const response = {
            status: 201,
        };
        return res.json(response);
    }
}

// Kullanıcı şifre yenileme kodu gönderme işlemi
exports.sendResetPasswordCode = async (req, res) => {
    const user = await User.findOne({ phone: req.body.data.phone });
    if (user) {
        if (user.resetPasswordCodeSendDate + 120000 > Date.now()) { // 2 dakikadan az süre geçmişse
            return res.status(202).json({
                status: 202,
            });
        }
        user.resetPasswordCode = Math.floor(Math.random() * 10000);
        await user.save()
        // SMS gönderme işlemi kullanıcıya

        return res.status(200).json({
            status: 200
        });
    } else {
        const response = {
            status: 201,
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
            };
            return res.json(response);
        } else {
            const response = {
                status: 201,
            };
            return res.json(response);
        }
    }
    const response = {
        status: 500,
    };
    return res.json(response);
}
