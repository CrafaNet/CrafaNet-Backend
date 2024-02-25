const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({ 
    comment: {
        type: String,
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    date: {
        type: Date,
        default: Date.now,
    },
    user: { // yorumu yapan kullanıcı (comment)
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    community: { // cevabı veren atölye (answer)
        type: Schema.Types.ObjectId,
        ref: 'Comunity',
    },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment; 