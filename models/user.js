const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String, required: true, maxlength: 100},
  last_name: {type: String, required: true, maxlength: 100},
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  friend_requests: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', UserSchema);