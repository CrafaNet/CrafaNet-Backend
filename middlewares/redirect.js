module.exports = (req, res, next) => {
    if (req.body.data.token) {
      return res.json({ status: 200, message: "Kullanıcı girişi yapılmış." });
    }
    next();
  };