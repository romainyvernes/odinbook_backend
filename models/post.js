const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  content: {type: String, required: true},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  reactions: [{
    type: String,
    enum: ['Like', 'Love', 'Angry', 'Care', 'Haha', 'Wow', 'Sad']
  }],
  date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Post', PostSchema);