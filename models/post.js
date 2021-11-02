const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    destination_profile: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    content: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now}
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// retrieves all direct comments to a post (not comments of comments)
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent_id'
});

PostSchema.virtual('reactions', {
  ref: 'Reaction',
  localField: '_id',
  foreignField: 'parent_id'
});

module.exports = mongoose.model('Post', PostSchema);