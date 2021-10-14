const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  first_name: {type: String, required: true, maxlength: 100},
  last_name: {type: String, required: true, maxlength: 100},
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  friend_requests_sent: [{type: Schema.Types.ObjectId, ref: 'User'}],
  friend_requests_received: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', UserSchema);