import {
  GET_ERRORS,
  GET_POSTS,
  GET_COMMENTS,
  DELETE_POST,
  UPDATE_POST,
  ADD_POST,
  MAP_POST_TO_COMMENTS,
  UNMAP_POST_TO_COMMENTS,
  GET_ACTION
} from "./types";
import axios from 'axios';
import { socket } from '../index';

export const getPosts = (posts) => dispatch => {
  // object to store all comments by their id to facilitate lookup
  const commentsObj = {};
  
  // array of posts without their comments
  const postsOnly = posts.reduce((arr, post) => {
    const { comments, ...restOfPost} = post;

    // map comments to their post ID in comments object
    commentsObj[post.id] = comments;

    // save post without its comments
    arr.push(restOfPost);

    return arr;
  }, []);
  
  dispatch({
    type: GET_POSTS,
    payload: postsOnly
  });
  
  // NOTE: comments added to redux state are only direct comments to a post.
  // When user chooses to load replies to comments, the additional comments
  // retrieved will be added to redux state
  dispatch({
    type: GET_COMMENTS,
    payload: commentsObj
  });
};

export const deletePost = (post) => dispatch => {
  axios.delete(`/api/posts/${post.id}`).then((response) => {
    // send deleted post back to server to broadcast to other users
    socket.emit('delete post', post);

    dispatch({
      type: DELETE_POST,
      payload: post
    });

    dispatch({
      type: UNMAP_POST_TO_COMMENTS,
      payload: post
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const updatePost = (post) => dispatch => {
  axios.put(`/api/posts/${post.id}`, {  
    content: post.content
  }).then((response) => {
    // send updated post back to server to broadcast to other users
    socket.emit('update post', response.data);

    dispatch({
      type: UPDATE_POST,
      payload: response.data
    });

    // store action in redux store to confirm above actions were dispatched
    dispatch({
      type: GET_ACTION,
      payload: {
        type: UPDATE_POST,
        payload: response.data
      }
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const addPost = (body) => dispatch => {
  axios.post('/api/posts', body).then((response) => {
    // send new post back to server to broadcast to other users
    socket.emit('new post', response.data);

    dispatch({
      type: ADD_POST,
      payload: response.data
    });

    dispatch({
      type: MAP_POST_TO_COMMENTS,
      payload: response.data
    });

    // store action in redux store to confirm above actions were dispatched
    dispatch({
      type: GET_ACTION,
      payload: {
        type: MAP_POST_TO_COMMENTS,
        payload: response.data
      }
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};
