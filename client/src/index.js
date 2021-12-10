import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { io } from 'socket.io-client';

// redux actions types
import { 
  ADD_COMMENT,
  ADD_POST, 
  DELETE_COMMENT, 
  DELETE_POST, 
  MAP_POST_TO_COMMENTS,
  UNMAP_POST_TO_COMMENTS,
  UPDATE_COMMENT,
  UPDATE_POST,
  ADD_COMMENT_REACTION,
  ADD_POST_REACTION,
  DELETE_COMMENT_REACTION,
  DELETE_POST_REACTION,
} from './actions/types';

// stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

// redux global state
import store from './store';

// initialize socket.io connection
const socket = io();

const dispatch = store.dispatch;

socket.on('new post', (post) => {
  dispatch({
    type: ADD_POST,
    payload: post
  });

  dispatch({
    type: MAP_POST_TO_COMMENTS,
    payload: post
  });
});

socket.on('update post', (post) => {
  dispatch({
    type: UPDATE_POST,
    payload: post
  });
});

socket.on('delete post', (post) => {
  dispatch({
    type: DELETE_POST,
    payload: post
  });

  dispatch({
    type: UNMAP_POST_TO_COMMENTS,
    payload: post
  });
});

socket.on('new comment', (comment) => {
  dispatch({
    type: ADD_COMMENT,
    payload: [comment]
  });
});

socket.on('update comment', (comment) => {
  dispatch({
    type: UPDATE_COMMENT,
    payload: comment
  });
});

socket.on('delete comment', (comment) => {
  dispatch({
    type: DELETE_COMMENT,
    payload: comment
  });
});

socket.on('new reaction', (reactionObj) => {
  if (reactionObj.comment) {
    dispatch({
      type: ADD_COMMENT_REACTION,
      payload: reactionObj
    });
  } else {
    dispatch({
      type: ADD_POST_REACTION,
      payload: reactionObj
    });
  }
});

socket.on('delete reaction', (reactionObj) => {
  if (reactionObj.comment) {
    dispatch({
      type: DELETE_COMMENT_REACTION,
      payload: reactionObj
    });
  } else {
    dispatch({
      type: DELETE_POST_REACTION,
      payload: reactionObj
    });
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

export { socket };