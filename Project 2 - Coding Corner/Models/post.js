var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  // IMPLEMENT AUTHOR TO SCHEMA FOR COMMENTS
  // author: {
  //   type: String,
  //   required: true,
  // }
}, {
    timestamps: true,
});

var postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: 
    {type: Schema.Types.ObjectId, ref: 'Profile'}
  ,
  main: {
    type: String,
    required: true
  },
  topics: String,
  private: { 
    type: Boolean, 
    default: false 
  },
  comments: [commentSchema],
  googleId: String
}, {
  timestamps: true,
  async: true
});

// embed author schema 
module.exports = mongoose.model('Post', postSchema);

