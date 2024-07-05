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
        required: true,
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
        type: Date,
        default: Date.now,
    },
    // Hesap doğrulama işlemi için kullanılacak olan veriler
    confirm: {
        type: Boolean,
        default: false,
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
    //Kullanıcının ilgi alanlarınaı işlemek için kullanılacak olan veriler
    myWatchVideos: [{  // Kullanıcının izlediği son videolar (15 adet obje tutulacak)
        type: Schema.Types.ObjectId,
        ref: 'Video',
    }], 
    likedShortVideos: [{ // Kullanıcının beğendiği kısa videolar (100 adet obje tutulacak)
        type: Schema.Types.ObjectId,
        ref: 'ShortVideo',
    }],
    clickGoToVideoInShortVideos: [{ // Kullanıcının kısa videolardan videoya gittiği videolar (15 adet obje tutulacak)
        type: Schema.Types.ObjectId,
        ref: 'ShortVideo',
    }],
    saveShortVideo: [{ // Kullanıcının kayıt ettiği son short videolar (20 adet obje tutulacak)
        type: Schema.Types.ObjectId,
        ref: 'ShortVideo',
    }],

});

const User = mongoose.model("User", UserSchema);
module.exports = User; 