import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// bootstrap components
import Button from 'react-bootstrap/Button';

// redux actions
import {
  sendFriendRequest, 
  deleteFriend, 
  addFriend, 
  cancelFriendRequest,
  declineFriendRequest
} from "../actions/friendActions";

// stylesheet
import '../styles/FriendButton.css';

function FriendButton({ 
  parent,
  auth, 
  sendFriendRequest, 
  deleteFriend,
  addFriend,
  declineFriendRequest,
  cancelFriendRequest,
  friends,
  shortVersion
}) {
  // NOTE: shortVersion allows to only display add friend button

  const handleAddFriend = () => {
    const body = {
      friendId: parent.id
    };
    
    sendFriendRequest(body, auth.user.username);
  };

  const handleDeleteFriend = () => {
    deleteFriend(auth.user, parent.id);
  };

  const handleAcceptRequest = () => {
    const body = {
      friendId: parent.id
    };

    addFriend(body, auth.user.username);
  };

  const handleDeclineRequest = () => {
    declineFriendRequest(auth.user.username, parent.id);
  };

  const handleCancelRequest = () => {
    cancelFriendRequest(auth.user.username, parent.id);
  };

  const renderFriendButton = () => {
    if (auth.user.id !== parent.id) {
      if (friends[auth.user.id]) {
        if (shortVersion !== true) {
          return <Button onClick={handleDeleteFriend}>Unfriend</Button>;
        } else {
          return null;
        }
      } else if (auth.user.incomingFriendRequests[parent.id]) {
        if (shortVersion !== true) {
          return (
            <>
              <Button onClick={handleAcceptRequest}>Accept request</Button>
              <Button onClick={handleDeclineRequest} className="reg-display">
                Decline friend request
              </Button>
            </>
          );
        } else {
          return null;
        }
      } else if (auth.user.outgoingFriendRequests[parent.id]) {
        if (shortVersion !== true) {
          return <Button onClick={handleCancelRequest}>Cancel request</Button>;
        } else {
          return null;
        }
      } else {
        return <Button onClick={handleAddFriend}>Add as friend</Button>;
      }
    } else {
      return null;
    }
  };
  
  return (
    <>
      {
        renderFriendButton()
      }
    </>
  )
}

FriendButton.propTypes = {
  auth: PropTypes.object.isRequired,
  sendFriendRequest: PropTypes.func.isRequired,
  deleteFriend: PropTypes.func.isRequired,
  addFriend: PropTypes.func.isRequired,
  cancelFriendRequest: PropTypes.func.isRequired,
  declineFriendRequest: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  friends: state.friends
})

const mapDispatchToProps = {
  sendFriendRequest,
  deleteFriend,
  addFriend,
  cancelFriendRequest,
  declineFriendRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendButton)
