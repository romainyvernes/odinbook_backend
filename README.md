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
[Live App](https://wispy-night-906.fly.dev)

![Odinbook](https://user-images.githubusercontent.com/65140547/145942680-55819a3a-a52d-4525-a7f6-17d681f8d26d.png)

### More
[Link to frontend](https://github.com/romainyvernes/odinbook_frontend)

### API

#### Authentication
- ##### POST /api/auth/register (create new user)
  *Body arguments: { username, password, email, firstName, lastName }*
- ##### POST /api/auth/login (authenticate existing user)
  *Body arguments: { email, password }*
- ##### GET /api/auth/logout
- ##### GET /api/auth/verify (check that a user is authenticated)

#### User
- ##### GET /api/users (search for users)
  *Query arguments: name={value} (value should be a string of either one or two names separated by a space)*
- ##### GET /api/users/:username (account info with all posts and their respective comments)
  *Query arguments: accountInfo=true (optional) (only account info w/o posts or comments)*
- ##### PUT /api/users/:username (update account details)
  *Body arguments: { password, email, firstName, lastName }*
- ##### DELETE /api/users/:username (delete user’s account)
- ##### PUT /api/users/:username/profile-picture (update authenticated user’s profile picture)
  *Body arguments: { image }*
- ##### GET /api/users/:username/friends (list of friends for given user)
- ##### POST /api/users/:username/friends (add new friend for given user, i.e., accept a friend request)
  *Body arguments: { friendId }*
- ##### DELETE /api/users/:username/friends/:friendId (delete one friend for given user)
- ##### GET /api/users/:username/requests (*query required)
  *Query arguments: received=true (only incoming friend requests)* 
  
  *Query arguments: sent=true (only outgoing friend requests)*
- ##### POST /api/users/:username/requests (send request to add new friend i.e., add friend to “requests sent” for current user and add current user to friend’s “requests received”)
  *Body arguments: { friendId }*
- ##### DELETE /api/users/:username/requests/:friendId (*query required)
  *Query arguments: decline=true (decline an incoming friend request)*
  
  *Query arguments: unsend=true (cancel outgoing friend request)*

#### Posts
- ##### GET /api/posts (*query required)
  *Query arguments: profileId (list of posts for given user)*
  
  *Query arguments: recent (list of recent posts in DB regardless of relationship to authenticated user)*
- ##### POST /api/posts (add a new post for given user)
  *Body arguments: { profileId, content }*
- ##### PUT /api/posts/:postId (edit a post)
  *Body arguments: { content }*
- ##### DELETE /api/posts/:postId (delete a post)

#### Reactions
- ##### POST /api/reactions (add a new reaction to given post/comment on given user profile)
  *Body arguments: { parentId, profileId, value }*
- ##### PUT /api/reactions/:reactionId (edit a reaction)
  *Body arguments: { value }*
- ##### DELETE /api/reactions/:reactionId (delete a reaction)

#### Comments
- ##### GET /api/comments (*query required)
  *Query arguments: parentId (list of comments with given parent comment) (has precedence over below query)*
  
  *Query arguments: postId (list of all comments for a given post)*
- ##### POST /api/comments (add a new comment for a given post/comment on given user profile)
  *Body arguments: { parentId, profileId, content }*
- ##### PUT /api/comments/:commentId (edit a comment)
  *Body arguments: { content }*
- ##### DELETE /api/comments/:commentId (delete a comment)

### Deployment
1. Add repo to selected server.
2. Add environment variables within server interface.
3. Configure `build` and `deploy` scripts in server interface.
