import { 
  ADD_COMMENT, 
  GET_ERRORS,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from "./types";
import axios from 'axios';
import { socket } from '../index';

export const addComment = (body) => dispatch => {
  axios.post('/api/comments', body).then((response) => {
    // send new comment back to server to broadcast to other users
    socket.emit('new comment', response.data);

    dispatch({
      type: ADD_COMMENT,
      payload: [response.data]
    });
  }).catch((err) => {
    console.log(err)
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const deleteComment = (comment) => dispatch => {
  axios.delete(`/api/comments/${comment.id}`).then((response) => {
    // send deleted comment back to server to broadcast to other users
    socket.emit('delete comment', comment);

    dispatch({
      type: DELETE_COMMENT,
      payload: comment
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const updateComment = (comment) => dispatch => {
  axios.put(`/api/comments/${comment.id}`, {  
    content: comment.content
  }).then((response) => {
    // send updated comment back to server to broadcast to other users
    socket.emit('update comment', response.data);

    dispatch({
      type: UPDATE_COMMENT,
      payload: response.data
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const loadComments = (parentId) => dispatch => {
  axios.get(`/api/comments?parentId=${parentId}`).then((response) => {
    dispatch({
      type: ADD_COMMENT,
      payload: response.data
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

