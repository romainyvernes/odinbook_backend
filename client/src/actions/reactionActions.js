import { 
  GET_ERRORS,
  ADD_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
  ADD_POST_REACTION,
  DELETE_POST_REACTION
} from "./types";
import axios from 'axios';
import { socket } from '../index';

export const addReaction = (body, parentElement) => dispatch => {
  axios.post('/api/reactions', body).then((response) => {
    if (parentElement.post_id) { // implies parent must be a comment
      // send new reaction back to server to broadcast to other users
      socket.emit('new reaction', {
        comment: parentElement,
        reaction: response.data
      });

      dispatch({
        type: ADD_COMMENT_REACTION,
        payload: {
          comment: parentElement,
          reaction: response.data
        }
      });
    } else {
      // send new reaction back to server to broadcast to other users
      socket.emit('new reaction', {
        post: parentElement,
        reaction: response.data
      });

      dispatch({
        type: ADD_POST_REACTION,
        payload: {
          post: parentElement,
          reaction: response.data
        }
      });
    }
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const deleteReaction = (reaction, parentElement) => dispatch => {
  axios.delete(`/api/reactions/${reaction._id}`).then((response) => {
    if (parentElement.post_id) { // implies parent must be a comment
      // send deleted reaction back to server to broadcast to other users
      socket.emit('delete reaction', {
        comment: parentElement,
        reaction
      });
      
      dispatch({
        type: DELETE_COMMENT_REACTION,
        payload: {
          comment: parentElement,
          reaction
        }
      });
    } else {
      // send deleted reaction back to server to broadcast to other users
      socket.emit('delete reaction', {
        post: parentElement,
        reaction
      });

      dispatch({
        type: DELETE_POST_REACTION,
        payload: {
          post: parentElement,
          reaction
        }
      });
    }
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};
