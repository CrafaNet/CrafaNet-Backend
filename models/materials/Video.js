const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({ 
    actieve: { // atölye videoyu atif pasif yapabilir
        type: Boolean,
    },
    video: { // dyntube gömme video
        type: String,
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
    },
});

const Video = mongoose.model("Video", VideoSchema);
module.exports = Video; 