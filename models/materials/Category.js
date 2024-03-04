const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({ 
    name: {
        type: String,
    }, 
    community: [{ // bu kategoride bulunan topluluklar
        type: Schema.Types.ObjectId,
        ref: 'Comunity',
    }],
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category; 