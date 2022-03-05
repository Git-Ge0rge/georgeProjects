const request = require('express');
var Post = require('../models/post');
var Profile = require('../models/profile');

function index(req, res, next){

    let myPosts 
    // if there is a user account, grab their posts
    if (req.user) {
        Profile.findByGoogleId(req.user.googleId, async function(err, profile) {
                const profileId = profile._id
            myPosts = await Post.find({author: profileId}) 
  
            res.render('posts/myPosts', { 
                // profile,    
                title: 'Your Posts',     
                user: req.user,
                name: req.query.name,
                myPosts
            })
        })
    } else {
        // initializing empty posts array to avoid errors in the find function 
        myPosts = []
        res.render('posts/myPosts', {   
            title: 'Your Posts',     
            user: req.user,
            name: req.query.name,
            myPosts
        })
    }
}

// function findByMyPosts = (req, res) => {
//     const googleId = req.user.googleId
//     Profile.findByGoogleId(googleId, function(err, profile) {
//       const profileId = profile._id
//       // find by this profile Id being the author and pass those posts into the ejs
//  })
// }

async function allPosts(req, res) {
    await Post.find({private: false}, function(err, posts) {
        res.render('posts/all', { 
            title: 'All posts', 
            posts,  
            user: req.user,
            name: req.query.name, 
        });
    });
}

async function show (req,res,next) {
    let post = await Post.findById(req.params.id)
    res.render('posts/show', {
        title: Post.title, 
        id: req.params.id,
        post,
        user: req.user,
        name: req.query.name, 
    });
}

async function showFavourites (req, res, next){
    await res.render('posts/favourites', {
        title: 'Your Favourited Posts:',
        user: req.user,
        name: req.query.name, 
    })
}

async function newPost(req, res, next){
    await res.render('posts/new', {
        title: 'Add a New Post:', 
        user: req.user,
        name: req.query.name, 
        method: 'POST',
    })
}
// icebox for after https://stackoverflow.com/questions/43962265/how-to-push-checked-checkboxes-values-into-an-array

function create(req, res, next){   
    Profile.findByGoogleId(req.user.googleId, function(err, profile) {
        // convert private's checkbox of nothing or "on" to boolean
        req.body.private = !!req.body.private;
        for (let key in req.body) {
          if (req.body[key] === '') delete req.body[key];
        }

        req.body.author = profile._id
        var post = new Post(req.body)
 
        post.save(function(err){
            if (err) return res.redirect('/posts/new');
            res.redirect(`posts/${post._id}`)
        // add id to end of redirect after finishing show funciton
    });
     })
}

function createComment(req, res, next){
    Post.findById(req.params.id, function(err, post) {
        post.comments.push(req.body)
        post.save(function(err){
            res.redirect(`/posts/${post._id}`)
        })
    })   
}

async function edit (req,res,next) {
    let post = await Post.findById(req.params.id)
    res.render('posts/edit', {
        title: "Edit Your Post", 
        id: req.params.id,
        post,
        user: req.user,
        name: req.query.name, 
    });
}

async function update(req, res, next){
    console.log('reached update function')
    console.log(req.user)
    // convert private's checkbox of nothing or "on" to boolean
    req.body.private = !!req.body.private;
    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
    req.body.author = req.user.id
    
    await Post.updateOne({ _id: req.params.id}, {...req.body})
        res.redirect(`/posts/${req.params.id}`)
}

// Delete function 
async function deletePost(req,res, next){
    console.log('reached function')
    await Post.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/posts'))
        .catch(() => res.redirect('/error'))
}

module.exports = {
    index,
    allPosts,
    show,
    showFavourites,
    newPost,
    create,
    createComment,
    edit,
    update,
    deletePost
}

