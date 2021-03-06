const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReactionSchema = new Schema({
  parent_id: {type: Schema.Types.ObjectId, required: true},
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  destination_profile: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  value: {
    type: String,
    enum: {
      values: ['Like', 'Love', 'Angry', 'Care', 'Haha', 'Wow', 'Sad'],
      message: 'Invalid value.'
    },
    required: true,
    default: 'Like'
  }
});

module.exports = mongoose.model('Reaction', ReactionSchema);