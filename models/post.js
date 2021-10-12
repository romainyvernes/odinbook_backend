const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  content: {type: String, required: true},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  reactions: [{
    value: {
      type: String,
      enum: ['Like', 'Love', 'Angry', 'Care', 'Haha', 'Wow', 'Sad'],
      required: true,
      default: 'Like'
    },
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
  }],
  date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Post', PostSchema);