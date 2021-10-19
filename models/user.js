const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    first_name: {type: String, maxlength: 100, required: true},
    last_name: {type: String, maxlength: 100, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    friend_requests_sent: [{type: Schema.Types.ObjectId, ref: 'User'}],
    friend_requests_received: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

UserSchema.virtual('name').get(function () {
  return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model('User', UserSchema);