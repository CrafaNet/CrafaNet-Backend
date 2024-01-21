const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({token:req.body.data.token});
    if (!user) {
      let msgError = 'Bu tokene sahip kullanıcı tespit edilmedi giriş yapan.';
      const response = {
          status: 600,
          message: msgError,
      };
      return res.json(response);
    }
    next();
  } catch (error) {
    // Hata yönetimi
    console.error(error);
    let msgError = 'Sunucu hatası';
    const response = {
        status: 500,
        message: msgError,
    };
    return res.json(response);
  }
};