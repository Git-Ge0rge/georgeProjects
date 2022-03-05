var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Post = require('../models/post');

const profileSchema = new mongoose.Schema({
        name: String,
        email: String,
        avatar: String,
        googleId: String,
        posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
    },
    { 
        timestamps: true
    }
);

// profileSchema.methods.findbyGoogleId(req.user._googleId) = 


// utility function to find GoogleId, called with 
profileSchema.static('findByGoogleId', function(googleId, cb) {
    return this.findOne({ googleId }, cb);
});

module.exports = mongoose.model('Profile', profileSchema);