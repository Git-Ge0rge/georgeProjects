# SEI Coding Corner

A class forum where you can login with Google and create useful posts to discuss and comment on content covered in class.

## Features

- Full CRUD Capability
- Google oAuth User Authentication
- MongoDB Atlas database
- Deployed via Heroku

## Technologies Used

- JavaScript
- MongoDB
- Express
- EJS View Engine
- Node.JS
- TinyMCE Text Editor Plugin
- Deployed via Heroku

## Screenshots

![Main Page ScreenShot](https://i.imgur.com/OppCwEZ.png)
![Post Example](https://i.imgur.com/W4aTkLC.png)

## ERD

![ERD Diagram](https://i.imgur.com/L9Pkval.png)

## Routing

#### Posts

| HTTP<br>Method | URL<br>Endpoint     | Controller<br>Action    | Purpose                                                                                      |
| -------------- | ------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| GET            | /posts              | postsCtrl.index         | View all the posts submitted by the logged in user                                           |
| GET            | /posts/all          | postsCtrl.allposts      | View all the posts regardless of who submitted (use querystring params to perform filtering) |
| GET            | /posts/:id          | postsCtrl.show          | View the details of any post                                                                 |
| GET            | /posts/new          | postsCtrl.newPost       | View a form for submitting a post (be sure to define this route before the show)route)       |
| POST           | /posts              | postsCtrl.create        | Handle the new post form being submitted                                                     |
| POST           | /posts/:id          | postsCtrl.createComment | Add a comment to the current topic thread                                                    |
| GET            | /posts/:id/edit     | postsCtrl.edit          | View a form for editing a post (restrict to user who submitted the post)                     |
| PUT            | /posts/:id/comments | postsCtrl.update        | Handle the edit post form being submitted (restrict to user who submitted the post)          |
| DELETE         | /posts/:id          | postsCtrl.deletePost    | Delete a post (restrict to user who submitted the post)                                      |

## Next Steps / IceBox Features

- Sort Functionality for Posts
- Username and account privileges
- Favourited Posts abilities
- Edit comment functionality
- CSS theme with Bootstrap / Tailwind CSS
