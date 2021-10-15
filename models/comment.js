const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  parent_id: {type: Schema.Types.ObjectId, required: true},
  content: {type: String, required: true},
  date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);