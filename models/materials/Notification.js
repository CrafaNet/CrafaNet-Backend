const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bir bildirim oluturulduğunda aynı bildirim ilgili tüm kullanıclara iletilecek ki database şişmesin ve kontrol edilebilir olsun
const NotificationSchema = new Schema({
    message: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
        de: {
            type: String,
        },
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: { // bildirim tipi: workshop, system, announcement (bildirim tipine göre ön yüzde farklı gösterim tarzları olabilir)
        type: String,
    },
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification; 