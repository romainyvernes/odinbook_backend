import { 
  USER_LOGOUT, 
  USER_LOGIN, 
  GET_ERRORS, 
  RESET_POSTS, 
  RESET_COMMENTS, 
  DISABLE_SIGNUP_FORM,
  DISABLE_POST_FORM,
  DISABLE_REACTIONS_LIST,
} from './types';
import axios from 'axios';

export const register = (body, history) => dispatch => {
  axios.post('/api/auth/register', body).then((response) => {
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

export const deleteAccount = (username) => dispatch => {
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
  }).catch((err) => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response
    });
  });
};
