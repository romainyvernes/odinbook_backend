import { 
  ADD_FRIEND_REQUEST, 
  ADD_FRIEND,
  GET_ERRORS,
  DELETE_FRIEND_REQUEST,
  GET_FRIENDS,
  DELETE_FRIEND,
  DELETE_FRIEND_FROM_AUTH,
  ADD_FRIEND_TO_AUTH,
  GET_ACTION,
} from "./types";
import axios from 'axios';

export const sendFriendRequest = (body, username) => dispatch => {
  axios.post(`/api/users/${username}/requests`, body).then((response) => {
    dispatch({
      type: ADD_FRIEND_REQUEST,
      payload: response.data
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

// add friend to auth AND friends objects
export const addFriend = (body, username) => dispatch => {
  axios.post(`/api/users/${username}/friends`, body).then((response) => {
    // add friend to friends object in redux store
    dispatch({
      type: ADD_FRIEND,
      payload: response.data.user
    });

    // add friend to friends object in redux store at auth.user
    dispatch({
      type: ADD_FRIEND_TO_AUTH,
      payload: response.data.friend
    });

    // remove added friend from outgoing friend requests in redux store
    dispatch({
      type: DELETE_FRIEND_REQUEST,
      payload: response.data.friend.id
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

// add friend to auth object ONLY
export const addFriendToAuth = (body, username) => dispatch => {
  axios.post(`/api/users/${username}/friends`, body).then((response) => {
    // add friend to friends object in redux store
    dispatch({
      type: ADD_FRIEND_TO_AUTH,
      payload: response.data.friend
    });

    // remove added friend from outgoing friend requests in redux store
    dispatch({
      type: DELETE_FRIEND_REQUEST,
      payload: response.data.friend.id
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const declineFriendRequest = (username, friendId) => dispatch => {
  axios.delete(`/api/users/${username}/requests/${friendId}?decline=true`)
       .then((response) => {
          dispatch({
            type: DELETE_FRIEND_REQUEST,
            payload: friendId
          });
        }).catch((err) => {
          dispatch({
            type: GET_ERRORS,
            payload: err.response
          });
        });
};

export const cancelFriendRequest = (username, friendId) => dispatch => {
  axios.delete(`/api/users/${username}/requests/${friendId}?unsend=true`)
       .then((response) => {
          dispatch({
            type: DELETE_FRIEND_REQUEST,
            payload: friendId
          });
        }).catch((err) => {
          dispatch({
            type: GET_ERRORS,
            payload: err.response
          });
        });
};

// removes friend from friends object in auth.user AND from friends object in 
// state.friends
export const deleteFriend = (user, friendId) => dispatch => {
  axios.delete(`/api/users/${user.username}/friends/${friendId}`).then((response) => {
    dispatch({
      type: DELETE_FRIEND,
      payload: {
        userId: user.id,
        friendId
      }
    });

    dispatch({
      type: DELETE_FRIEND_FROM_AUTH,
      payload: friendId
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

// removes friend from friends object in auth.user ONLY
export const deleteFriendFromAuth = (user, friendId) => dispatch => {
  axios.delete(`/api/users/${user.username}/friends/${friendId}`).then((response) => {
    dispatch({
      type: DELETE_FRIEND_FROM_AUTH,
      payload: friendId
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const saveFriends = (friends) => dispatch => {
  dispatch({
    type: GET_FRIENDS,
    payload: friends
  });
};

export const getFriends = (username) => dispatch => {
  axios.get(`/api/users/${username}/friends`).then((response) => {
    dispatch({
      type: GET_FRIENDS,
      payload: response.data
    });

    // store action in redux store to confirm above action was dispatched
    dispatch({
      type: GET_ACTION,
      payload: {
        type: GET_FRIENDS,
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

export const getIncomingFriendRequests = (username) => dispatch => {
  axios.get(`/api/users/${username}/requests?received=true`).then((response) => {
    dispatch({
      type: GET_FRIENDS,
      payload: response.data.friendRequestsReceived
    });

    // store action in redux store to confirm above action was dispatched
    dispatch({
      type: GET_ACTION,
      payload: {
        type: GET_FRIENDS,
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
