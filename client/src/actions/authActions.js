import { 
  USER_LOGOUT, 
  USER_LOGIN, 
  GET_ERRORS, 
  RESET_POSTS, 
  RESET_COMMENTS, 
  DISABLE_SIGNUP_FORM,
  DISABLE_POST_FORM,
  DISABLE_REACTIONS_LIST,
  CLEAR_ERRORS
} from './types';
import axios from 'axios';

export const register = (body, history) => dispatch => {
  axios.post('/api/auth/register', body).then((response) => {
    // delete potential errors stored in redux store
    dispatch({
      type: CLEAR_ERRORS
    });

    // close sign up form
    dispatch({
      type: DISABLE_SIGNUP_FORM
    });

    // if successful, display success message with link to log in
    history.push('/');
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const login = (body) => dispatch => {
  axios.post('/api/auth/login', body).then((response) => {
    // delete potential errors stored in redux store
    dispatch({
      type: CLEAR_ERRORS
    });

    dispatch({
      type: USER_LOGIN,
      payload: response.data
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const logout = (history) => dispatch => {
  axios.get('/api/auth/logout').then((response) => {
    dispatch({
      type: USER_LOGOUT
    });

    dispatch({
      type: RESET_POSTS
    });

    dispatch({
      type: RESET_COMMENTS
    });

    dispatch({
      type: DISABLE_SIGNUP_FORM
    });

    dispatch({
      type: DISABLE_POST_FORM
    });

    dispatch({
      type: DISABLE_REACTIONS_LIST
    });

    history.push('/');
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const verifyAuth = () => dispatch => {
  axios.get('/api/auth/verify').then((response) => {
    dispatch({
      type: USER_LOGIN,
      payload: response.data
    });
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};

export const deleteAccount = (username, history) => dispatch => {
  axios.delete(`/api/users/${username}`).then((response) => {
    dispatch({
      type: USER_LOGOUT
    });

    dispatch({
      type: RESET_POSTS
    });

    dispatch({
      type: RESET_COMMENTS
    });

    history.push('/');
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};
