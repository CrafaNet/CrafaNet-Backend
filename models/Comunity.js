const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComunitySchema = new Schema({ 
    actieve: { // atölye kayıt ücretini ödedikten sonra aktifleşir
        type: Boolean,
    },
    name: {
        type: String,
    },
    price: { // Workshop'un aylık üyelik ücreti
        type: Number,
    },
    description: { // atölyenin açıklaması min 100 karakter max 250 karakter
        type: String,
    },
    promoIllustiration: { // illüstrasyonlar arasından atölye birini seçecek
        type: String,
    },
    coverImage: { // atölyenin listelendiği sayfada bulunan kapak resmi
        type: String,
    },
    // her workshop max 3 kategoriye sahip olabilir
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'materials/Category',
    }],
    // her workshop sınıfında bulunan öğrenciler
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    // her workshop sınıfında bulunan kayıtlı VR videolar
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'materials/Video',
    }],
});

const Comunity = mongoose.model("Comunity", ComunitySchema);
module.exports = Comunity; 