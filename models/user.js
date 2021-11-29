const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    first_name: {type: String, maxlength: 100, required: true},
    last_name: {type: String, maxlength: 100, required: true},
    picture: {
      type: Buffer, 
      required: true, 
      default: Buffer.from("https://user-images.githubusercontent.com/65140547/143936277-db605564-682e-4122-a09d-b930d21c51c8.png")
    },
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