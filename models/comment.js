const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  parent_post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
  content: {type: String, required: true},
  reactions: [{
    value: {
      type: String,
      enum: ['Like', 'Love', 'Angry', 'Care', 'Haha', 'Wow', 'Sad'],
      required: true,
      default: 'Like'
    },
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
  }],
  date: {type: Date, required: true, default: Date.now},
  replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Comment', CommentSchema);