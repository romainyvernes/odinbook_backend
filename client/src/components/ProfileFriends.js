import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// stylesheet
import '../styles/ProfileFriends.css';

// redux actions
import { 
  deleteFriend, 
  deleteFriendFromAuth,
  addFriendToAuth,
  declineFriendRequest,
  cancelFriendRequest,
} from '../actions/friendActions';

// components
import DropdownMenu from './DropdownMenu';
import FriendButton from './FriendButton';

function ProfileFriends({ 
  friends, 
  deleteFriend, 
  auth, 
  user,
  deleteFriendFromAuth,
  addFriendToAuth,
  declineFriendRequest,
  cancelFriendRequest,
}) {
  const friendsArr = Object.keys(friends).map((key) => friends[key]);
  
  const handleUnfriend = (userId, friendId) => {
    // check if unfriended user is displayed on authenticated user's profile
    if (userId === auth.user.id) {
      deleteFriend(auth.user, friendId);
    } else {
      deleteFriendFromAuth(auth.user, friendId);
    }
  };

  const handleAcceptRequest = (friendId) => {
    const body = {
      friendId
    };

    addFriendToAuth(body, auth.user.username);
  };

  const handleDeclineRequest = (friendId) => {
    declineFriendRequest(auth.user.username, friendId);
  };

  const handleCancelRequest = (friendId) => {
    cancelFriendRequest(auth.user.username, friendId);
  };

  const getDropdownItems = (friend) => {
    if (auth.user.friends[friend.id]) {
      return [
        {
          label: "Unfriend",
          function: () => {
            handleUnfriend(user.id, friend.id);
          }
        }
      ];
    } else if (auth.user.incomingFriendRequests[friend.id]) {
      return [
        {
          label: "Accept friend request",
          function: () => {
            handleAcceptRequest(friend.id);
          }
        },
        {
          label: "Decline friend request",
          function: () => {
            handleDeclineRequest(friend.id);
          }
        }
      ];
    } else if (auth.user.outgoingFriendRequests[friend.id]) {
      return [
        {
          label: "Cancel friend request",
          function: () => {
            handleCancelRequest(friend.id);
          }
        }
      ];
    } else {
      return [];
    }
  };
  
  return (
    <section className="profile-friends primary-frame primary-bg-color">
      <header>
        <h2>Friends</h2>
      </header>
      {
        friendsArr.length > 0
          ? <ul className="profile-friends-list">
              {
                friendsArr.map((friend) => (
                  <li key={friend.id} className="senary-frame">
                    <div className="friend-id-wrapper">
                      <a href={`/${friend.username}`} className="link-wrapper">
                        <img src={friend.picture.url} 
                            alt="user's profile avatar"
                            className="friend-picture" />
                      </a>
                      <a href={`/${friend.username}`}>
                        <h3>{friend.name}</h3>
                      </a>
                    </div>
                    {
                      // only display something if listed user is not 
                      // authenticated user, and display an add friend button
                      // if listed user is not friends w/ authenticated user
                      friend.id !== auth.user.id
                        ? !auth.user.friends[friend.id]
                            ? <FriendButton shortVersion={true} parent={friend} />
                            : <DropdownMenu items={getDropdownItems(friend)} />
                        : null
                    }
                  </li>
                ))
              }
            </ul>
          : <p className="no-data-msg">There is no one here.</p>
      }
    </section>
  )
}

ProfileFriends.propTypes = {
  deleteFriend: PropTypes.func.isRequired,
  friends: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteFriendFromAuth: PropTypes.func.isRequired,
  addFriendToAuth: PropTypes.func.isRequired,
  declineFriendRequest: PropTypes.func.isRequired,
  cancelFriendRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  friends: state.friends,
  auth: state.auth,
});

export default connect(mapStateToProps, { 
  deleteFriend,
  deleteFriendFromAuth,
  addFriendToAuth,
  declineFriendRequest,
  cancelFriendRequest,
})(ProfileFriends);
