const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    parent_id: {type: Schema.Types.ObjectId, required: true},
    post_id: {type: Schema.Types.ObjectId, required: true, ref: 'Post'},
    destination_profile: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    content: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now}
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent_id'
});

CommentSchema.virtual('reactions', {
  ref: 'Reaction',
  localField: '_id',
  foreignField: 'parent_id'
});

module.exports = mongoose.model('Comment', CommentSchema);