/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { connect, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { Switch, Route, NavLink } from "react-router-dom";

// stylesheet
import '../styles/Profile.css';

// redux action types
import { GET_ERRORS } from '../actions/types';

// redux actions
import { getPosts } from '../actions/postActions';
import { saveFriends } from "../actions/friendActions";
import { enableUploadPicture } from "../actions/overlaysActions";

// icons
import { BsCameraFill } from 'react-icons/bs';

// bootstrap components
import Spinner from 'react-bootstrap/Spinner';

// components
import ProfilePosts from "./ProfilePosts";
import ProfileFriends from "./ProfileFriends";
import FriendButton from "./FriendButton";
import Error from "./Error";

function Profile({ 
  match, 
  getPosts, 
  posts,
  saveFriends,
  auth,
  enableUploadPicture,
}) {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const loading = useRef(true);
  
  // retrieve user info, posts, and comments upon mounting
  useEffect(() => {
    /* params property of the match object refers to parameters set in route URI
    NOTE: API call is made locally rather than in redux action because the route
    differs in each component where posts appear */
    axios.get(`/api/users/${match.params.username}`).then((response) => {
      loading.current = false;
      
      // save info about owner of profile displayed to local state
      setUser(response.data.user);
      
      // save posts being displayed to redux store
      getPosts(response.data.posts);
      
      // save friends to redux store
      saveFriends(response.data.user.friends);
    }).catch((err) => {
      loading.current = false;

      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
  }, []);
  
  return (
    <div className="profile">
      {
        !loading.current
          ? user.name !== undefined
            ? <>
                <header className="profile-header primary-bg-color quinary-frame">
                  <div>
                    {
                      user.username === auth.user.username
                        ? <button onClick={enableUploadPicture} className="profile-upload-btn">
                            <img src={user.picture.url} 
                                alt="user's profile avatar"
                                className="user-picture" />
                            <div className="profile-upload-icon">
                              <BsCameraFill />
                            </div>
                          </button>
                        : <img src={user.picture.url} 
                                alt="user's profile avatar"
                                className="user-picture" />
                    }
                    <h1>{user.name}</h1>
                  </div>
                  <div className="profile-nav">
                    <ul className="navigation-links">
                      <li>
                        <NavLink exact to={`/${user.username}`} 
                                activeClassName="selected" 
                                className="nav-link hovered-link light-bold">
                          Posts
                        </NavLink>
                      </li>
                      <li>
                        <NavLink exact to={`/${user.username}/friends`} 
                                activeClassName="selected" 
                                className="nav-link hovered-link light-bold">
                          Friends
                        </NavLink>
                      </li>
                    </ul>
                    <div className="friend-btn">
                      <FriendButton parent={user} />
                    </div>
                  </div>
                </header>
                <main>
                  <Switch>
                    <Route exact path="/:username" render={() => (
                      <ProfilePosts user={user} />
                    )} />
                    <Route path="/:username/friends" render={() => (
                      <ProfileFriends user={user} />
                    )} />
                    <Route path="/:username/*" component={Error} />
                  </Switch>
                </main>
              </>
            : null
          : <>
              <Spinner variant="primary" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
      }
    </div>
  );
}

Profile.propTypes = {
  posts: PropTypes.array.isRequired,
  getPosts: PropTypes.func.isRequired,
  saveFriends: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  enableUploadPicture: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps, { 
  getPosts, 
  saveFriends,
  enableUploadPicture,
})(Profile);