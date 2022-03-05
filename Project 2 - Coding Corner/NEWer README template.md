A README.md file with these sections:

☐ App Title: Contains a description of what the app does and optional background info.
SEI CODING CORNER

☐ Screenshot(s): A screenshot of your app's landing page and any other screenshots of interest.

☐ Technologies Used: List of the technologies used.

JavaScript

MongoDB
Express
EJS View Engine
Node.JS

TinyMCE text editor

Deployed via: \_\_\_

☐ Getting Started: Include a link to the deployed app and your Trello board with the project's planning.

☐ Next Steps: Planned future enhancements (icebox items).
Favourites page
sort functionality

## Routing

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
