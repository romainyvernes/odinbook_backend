const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  destination_profile: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  content: {type: String, required: true},
  date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Post', PostSchema);