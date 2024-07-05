const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShortVideoSchema = new Schema({ 
    actieve: { // atölye videoyu atif pasif yapabilir
        type: Boolean,
    },
    shortVideo: { // dyntube gömme video
        type: String,
    },
    video: { // shortVideonun alındığı video id si
        type: Schema.Types.ObjectId,
        ref: 'Video',
    },
    name: {
        type: String,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    publicationDate: { // video yayınlanma tarihi
        type: Date,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    }
});

const ShortVideo = mongoose.model("ShortVideo", ShortVideoSchema);
module.exports = ShortVideo; 