const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findOne({ token: req.body.data.token });
        if (user.phone === "+905534083450") {
            next();
        } else {
            const response = {
                status: 202,
                message: "message_auth_202"
            };
            return res.json(response);
        }
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            error: error,
            message: "message_auth_500"
        };
        return res.json(response);
    }
}