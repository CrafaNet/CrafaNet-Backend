const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    token: {
        type: String,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    },
    birthDate: {
        type: String,
    },
    profilImg: {
        type: String,
    },
    language: {
        type: String,
    },
    country: {
        type: String,
    },
    notifications:[{
        type: Schema.Types.ObjectId,
        ref: 'Notification',
    }],
    // Kullanıcının kayıt olduğu tarih
    registerDate: {
        type: String,
    },
    // Hesap doğrulama işlemi için kullanılacak olan veriler
    confirm: {
        type: Boolean,
    },
    confirmCode: {
        type: String,
    },
    confirmCodeSendDate: {
        type: Date,
    },
    // Kullanıcının şifresini sıfırlama işlemi için kullanılacak olan veriler
    resetPasswordCode: {
        type: String,
    },
    resetPasswordCodeSendDate: {
        type: Date,
    },
    interestWorkshop: { 
        type: Schema.Types.ObjectId,
        ref: 'Comunity',
    },
    interestSkillHubPosts: {
        type: Schema.Types.ObjectId,
        ref: 'SkillHubPost',
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User; 