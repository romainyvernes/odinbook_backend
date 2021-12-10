## Odinbook Backend
### Description
Back-end part of a MERN application that recreates some of the main features of Facebook.

### Features
 - Create your own account, or simply log in as guest user. The home page displays recent posts across the entire platform, which anyone can comment on and like.
 - Observe changes in real time as other users interact with posts and comments, or create their own.
 - Conveniently create new posts from the home page, or directly on your own profile page. All posts and comments that belong to you can be updated or deleted at any time. 
 - Manage your friends list and incoming friend requests on a dedicated dashboard. 
 - Search for new friends amongst the platform's membership using the search tool in the top navigation bar.
 - Manage your account settings to update your name, email, or password, and to delete your account (disabled on guest user account)

### Core technologies
 - React (UI framework)
 - Redux (state management)
 - React bootstrap (UI)
 - Axios (API calls)
 - Socket.io (real-time features)
 - MongoDB (database)
 - Express (Node framework)
 - Node.JS (backend environment)
 - AWS S3 (image storage)
 - Passport.JS (authentication)

### Preview
[Live App](https://odinbook-social.herokuapp.com/)

### More
[Link to frontend](https://github.com/romainyvernes/odinbook_frontend)

### API
Authentication:

POST /api/auth/register (create new user)
   body args: { username, password, email, firstName, lastName }
POST /api/auth/login (authenticate existing user)
   body args: { email, password }
GET /api/auth/logout
GET /api/auth/verify (check that a user is authenticated)

User:

GET /api/users (search for users)
  ?name={value} (value should be a string of either one or two names separated by a space)

GET /api/users/:username (account info with all posts and their respective comments)
  ?accountInfo=true (optional) (only account info w/o posts or comments)
PUT /api/users/:username (update account details)
   body args: { password, email, firstName, lastName }
DELETE /api/users/:username (delete user’s account)

PUT /api/users/:username/profile-picture (update authenticated user’s profile picture)
  body args: { image }

GET /api/users/:username/friends (list of friends for given user)
POST /api/users/:username/friends (add new friend for given user, i.e., accept a friend request)
   body args: { friendId }
DELETE /api/users/:username/friends/:friendId (delete one friend for given user)

GET /api/users/:username/requests (*query required)
  ?received=true (only incoming friend requests)
  ?sent=true (only outgoing friend requests)
POST /api/users/:username/requests (send request to add new friend i.e., add friend to “requests sent” for current user and add current user to friend’s “requests received”)
   body args: { friendId }
DELETE /api/users/:username/requests/:friendId (*query required)
  ?decline=true (decline an incoming friend request)
  ?unsend=true (cancel outgoing friend request)

Posts:

GET /api/posts (*query required)
   ?profileId (list of posts for given user)
   ?recent (list of recent posts in DB regardless of relationship to authenticated user) 
POST /api/posts (add a new post for given user)
    body args: { profileId, content }
PUT /api/posts/:postId (edit a post)
    body args: { content }
DELETE /api/posts/:postId (delete a post)

Reactions:

POST /api/reactions (add a new reaction to given post/comment on given user profile)
   body args: { parentId, profileId, value }
PUT /api/reactions/:reactionId (edit a reaction)
   body args: { value }
DELETE /api/reactions/:reactionId (delete a reaction)

Comments:

GET /api/comments (*query required)
   ?parentId (list of comments with given parent comment) (*has precedence over below query)
   ?postId (list of all comments for a given post)
POST /api/comments (add a new comment for a given post/comment on given user profile)
   body args: { parentId, profileId, content }
PUT /api/comments/:commentId (edit a comment)
   body args: { content }
DELETE /api/comments/:commentId (delete a comment)

