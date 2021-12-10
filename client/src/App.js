/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { 
  Route, 
  Switch,
  withRouter,
} from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// use unique IDs to force re-renders of components every time navigation links
// are clicked
import { v4 as uuid } from 'uuid';

// bootstrap components
import Modal from 'react-bootstrap/Modal';

// redux action
import { verifyAuth } from './actions/authActions';
import { 
  disablePostForm, 
  disableReactionsList, 
  disableSignupForm,
  disableUploadPicture,
} from './actions/overlaysActions';

// stylesheet
import './styles/App.css';

// components
import Profile from './components/Profile';
import Login from './components/auth/Login';
import FriendsDashboard from './components/FriendsDashboard';
import Newsfeed from './components/Newsfeed';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import PostForm from './components/PostForm';
import ReactionsList from './components/ReactionsList';
import Register from './components/auth/Register';
import SettingsDashboard from './components/SettingsDashboard';
import UploadPicture from './components/UploadPicture';
import Error from './components/Error';

function App({ 
  auth, 
  verifyAuth, 
  errors, 
  overlays,
  disablePostForm,
  disableReactionsList,
  disableSignupForm,
  disableUploadPicture,
  history,
}) {
  useEffect(() => {
    // forward all errors to error page
    if (errors?.response?.status >= 400) {
      history.push('/error');
    }
  }, [errors]);
  
  useEffect(() => {
    // check once, upon rendering of App, whether user is already authenticated
    verifyAuth();
  }, []);

  const { postForm, reactionsList, signupForm, uploadPicture } = overlays;

  const handleHideModal = () => {
    if (postForm.isEnabled) {
      disablePostForm();
    }
    if (reactionsList.isEnabled) {
      disableReactionsList();
    }
    if (signupForm.isEnabled) {
      disableSignupForm();
    }
    if (uploadPicture.isEnabled) {
      disableUploadPicture();
    }
  };

  const handleShowModal = () => {
    const overlayKeys = Object.keys(overlays);

    for (let key of overlayKeys) {
      if (overlays[key].isEnabled) {
        return true;
      }
    }
    
    return false;
  };
  
  return (
    <div className="App">
      <Modal show={handleShowModal()} 
            onHide={handleHideModal}
            backdropClassName="overlay-bg"
            dialogClassName={`quaternary-frame ${uploadPicture.isEnabled ? "upload-picture" : ""}`}>
        {
          postForm.isEnabled && <PostForm />
        }
        {
          reactionsList.isEnabled && <ReactionsList />
        }
        {
          signupForm.isEnabled && <Register />
        }
        {
          uploadPicture.isEnabled && <UploadPicture />
        }
      </Modal>

      {
        auth.isAuthenticated
          && <Navbar />
      }

      <Route exact path="/error" component={Error} />

      {
        auth.isAuthenticated
          ? <Switch>
              <Route exact path="/" render={() => <Newsfeed key={uuid()} />} />
              <PrivateRoute path="/friends" component={FriendsDashboard} />
              <PrivateRoute path="/settings" component={SettingsDashboard} />
              <PrivateRoute path="/:username" component={Profile} />
            </Switch>
          : <Route exact path="/" component={Login} />
      }
    </div>
  );
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  verifyAuth: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  overlays: PropTypes.object.isRequired,
  disablePostForm: PropTypes.func.isRequired,
  disableReactionsList: PropTypes.func.isRequired,
  disableSignupForm: PropTypes.func.isRequired,
  disableUploadPicture: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
    overlays: state.overlays
  };
};

export default connect(mapStateToProps, { 
  verifyAuth,
  disablePostForm,
  disableReactionsList,
  disableSignupForm,
  disableUploadPicture,
})(withRouter(App));
