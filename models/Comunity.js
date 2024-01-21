const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    // her workshop max 3 kategoriye sahip olabilir
    categories: [{
        type: String,
    }],
    // her workshop sınıfında bulunan öğrenciler
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    // her workshop sınıfında bulunan öğretmenler
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    // her workshop sınıfında bulunan kayıtlı videolar
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'materials/Video',
    }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User; 