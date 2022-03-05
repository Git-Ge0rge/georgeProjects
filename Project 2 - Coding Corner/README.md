# Coding Corner

## Intro

Coding Corner is an open source and open access forum for the students of General Assembly's SEI 46 Flex Program to be able to talk about class concepts and provide examples to help increase learning retention and to find alternative ways to look at different concepts taught in class.

## Example Data Model

Here's the ERD we'll use as an example: (Add my own after)

<img src="https://i.imgur.com/hU1PVHI.png">

### CHANGE OR DELETE THIS SECTION User Has Two Different Relationships with posts

Note that in this app, a user "recommends" a post to other users by creating it in the database. This one-to-many relationship is modeled with a `userRecommending` property on the post model that references the `_id` of the user that created each particular post.

In addition, users can add posts to their reading list. This many-to-many relationship is modeled with a `usersReading` property which references an array of user documents' `_id` values.

### Comments

Because comments are being embedded within the post documents, there is no Comment model, just a schema.

#### Restricting Updating and/or Deleting of Comments Functionality

Each comment needs to know the user that submitted it. Not just for display purposes, but to restrict the ability to update and/or delete a comment to that of the user that submitted it. The `userId` property in the comment schema holds the `_id` of the user that submitted the comment and can therefore be compared to the logged in user's `_id` to render the additional UI for updating/deleteing.

#### Copying Data For Better Efficiency

Since displaying the name of the user commenting on a post makes sense, note that, in addition to the `userId` property, the comment schema also has a `userName` property for holding the user's name.

Copying over the user's name from `req.user` in the comment `create` action will avoid having to populate comments every time they are accessed. This provides much better efficiency.

## Example Routing

#### posts

| HTTP<br>Method | URL<br>Endpoint | Controller<br>Action    | Purpose                                                                                      |
| -------------- | --------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| GET            | /posts          | postsCtrl.index         | View all the posts submitted by the logged in user                                           |
| GET            | /posts/all      | postsCtrl.allposts      | View all the posts regardless of who submitted (use querystring params to perform filtering) |
| GET            | /posts/:id      | postsCtrl.show          | View the details of any post                                                                 |
| GET            | /posts/new      | postsCtrl.newPost       | View a form for submitting a post (be sure to define this route before the show route)       |
| POST           | /posts          | postsCtrl.create        | Handle the new post form being submitted                                                     |
| POST           | /posts/:id      | postsCtrl.createComment | Add a comment to the current topic thread                                                    |
| GET            | /posts/:id/edit | postsCtrl.edit          | View a form for editing a post (restrict to user who submitted the post)                     |
| PUT            | /posts/:id      | postsCtrl.update        | Handle the edit post form being submitted (restrict to user who submitted the post)          |
| DELETE         | /posts/:id      | postsCtrl.deletePost    | Delete a post (restrict to user who submitted the post)                                      |
|                |
|                |

#### Comments

| HTTP<br>Method | URL<br>Endpoint     | Controller<br>Action | Purpose                                                                                                      |
| -------------- | ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| n/a            | n/a                 | index action         | View all the comments for a post - no route needed since comments are embedded and displayed with their post |
| n/a            | n/a                 | show action          | Viewing a single comment does not make sense                                                                 |
| n/a            | n/a                 | new action           | The form to add a new comment should be displayed on the post's show view                                    |
| POST           | /posts/:id/comments | commentsCtrl.create  | Handle the new comment form being submitted                                                                  |
| GET            | /comments/:id/edit  | commentsCtrl.edit    | View a form for editing a comment (restrict to user who submitted the comment)                               |
| PUT            | /comments/:id       | commentsCtrl.update  | Handle the edit comment form being submitted (restrict to user who submitted the comment)                    |
| DELETE         | /comments/:id       | commentsCtrl.delete  | Delete a comment (restrict to user who submitted the comment)                                                |

## Example Controller Code

#### Creating a post

```js
function create(req, res) {
  const post = new post(req.body);
  // Assign the logged in user's id
  post.user = req.user._id;
  post.save(function(err) {
    if (err) return render(<new or custom error template>);
    // Probably want to go to newly added post's show view
    res.redirect(`/posts/${post._id}`);
  });
}
```

#### Edit a post

```js
function edit(req, res) {
  post.findById(req.params.id, function (err, post) {
    // Verify post is "owned" by logged in user
    if (!post.user.equals(req.user._id)) return res.redirect("/posts");
    res.render("posts/edit", { post });
  });
}
```

#### Adding a post to a user's reading list

```js
function addReading(req, res) {
  post.findById(req.params.id, function (err, post) {
    // Ensure that user is not already in usersReading
    // See "Finding a Subdocument" in https://mongoosejs.com/docs/subdocs.html
    if (post.usersReading.id(req.user._id)) return res.redirect("/posts");
    post.usersReading.push(req.user._id);
    post.save(function (err) {
      res.redirect(`/posts/${post._id}`);
    });
  });
}
```

#### View all posts or based upon a name search

```js
function allposts(req, res) {
  // Make the query object to use with post.find based upon
  // if the user has submitted via a search form for a post name
  let postQuery = req.query.name
    ? { name: new RegExp(req.query.name, "i") }
    : {};
  post.find(postQuery, function (err, posts) {
    // Why not reuse the posts/index template?
    res.render("/posts/index", {
      posts,
      user: req.user,
      nameSearch: req.query.name, // use to set content of search form
    });
  });
}
```

#### Add a comment

A form used to create a comment would look something like:

```html
<!-- Using the RESTful route to send the post's id to the server -->
<form action="/posts/<%= post._id %>/comments" method="POST">
  <!-- Be sure name attributes of inputs match the model properties -->
  <input name="text" />
  <button type="submit">ADD COMMENT</button>
</form>
```

In the comment controller's create action, we'll need to first find the post to add the comment to:

```js
function create(req, res) {
  post.findById(req.params.id, function (err, post) {
    // Update req.body to contain user info
    req.body.userId = req.user._id;
    req.body.userName = req.user.name;
    // Add the comment
    post.comments.push(req.body);
    post.save(function (err) {
      res.redirect(`/posts/${post._id}`);
    });
  });
}
```

#### Update a comment

A form used to edit a data resource needs to use a query string to inform method-override middleware to change the post to a PUT request:

```html
<form action="/comments/<%= comment._id %>?_method=PUT" method="POST">
  <!-- Value attribute is being set to the comment's current text -->
  <input name="text" value="<%= comment.text %>" />
  <button type="submit">UPDATE COMMENT</button>
</form>
```

When the edit comment form is submitted, the `update` action will need to find the **post** that the comment is embedded within based upon the `_id` of the comment being sent as a route parameter:

```js
function update(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  post.findOne({ "comments._id": req.params.id }, function (err, post) {
    // Find the comment subdoc using the id method on Mongoose arrays
    // https://mongoosejs.com/docs/subdocs.html
    const commentSubdoc = post.comments.id(req.params.id);
    // Ensure that the comment was created by the logged in user
    if (!commentSubdoc.userId.equals(req.user._id))
      return res.redirect(`/posts/${post._id}`);
    // Update the text of the comment
    commentSubdoc.text = req.body.text;
    // Save the updated post
    post.save(function (err) {
      // Redirect back to the post's show view
      res.redirect(`/posts/${post._id}`);
    });
  });
}
```

#### Delete a comment

A form used to delete a data resource needs to use a query string to inform method-override middleware to change the post to a DELETE request.

Also, note that the proper RESTful route passes the `_id` of the comment, not the post that it's embedded within:

```html
<form action="/comments/<%= comment._id %>?_method=DELETE" method="POST">
  <button type="submit">DELETE COMMENT</button>
</form>
```

However, you'll only want to render the above form if the comment was created by the logged in user - you don't want users deleting each other's comments! Here's how you can conditionally render the delete comment form for only the comments created by the logged in user:

```html
<% post.comments.forEach(function(comment) { %>
<div class="comment">
  <%= comment.text %><br />
  <% if (comment.userId.equals(user._id)) { %>
  <form action="/comments/<%= comment._id %>?_method=DELETE" method="POST">
    <button type="submit">X</button>
  </form>
  <% } %>
</div>
<% }) %>
```

> Note that using a simple "X" as the button text, along with some styling provides for a decent UI.

When the delete comment form is submitted, just like with the `update` action above, the `delete` action will need to find the **post** that the comment is embedded within based upon the `_id` of the comment being sent as a route parameter:

```js
function delete(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  post.findOne({'comments._id': req.params.id}, function(err, post) {
    // Find the comment subdoc using the id method on Mongoose arrays
    // https://mongoosejs.com/docs/subdocs.html
    const commentSubdoc = post.comments.id(req.params.id);
    // Ensure that the comment was created by the logged in user
    if (!commentSubdoc.userId.equals(req.user._id)) return res.redirect(`/posts/${post._id}`);
    // Remove the comment using the remove method of the subdoc
    commentSubdoc.remove();
    // Save the updated post
    post.save(function(err) {
      // Redirect back to the post's show view
      res.redirect(`/posts/${post._id}`);
    });
  });
}
```

## Avoiding Having to Pass `user` Every `render`

How about a small custom middleware that relieves us from having to pass `user: req.user` every time a view is rendered!!!!

Just add the following in `server.js` BELOW the two `app.use(passport...)` middleware:

```js
// Add this middleware BELOW passport middleware
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
```

The `res.locals` is an object whose properties are available inside of any view being rendered!
