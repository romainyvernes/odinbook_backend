/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// stylesheet
import '../styles/FriendsDashboard.css';

// bootstrap components
import { FaUserFriends } from 'react-icons/fa';
import { BsFillPersonPlusFill } from 'react-icons/bs';

// redux actions
import { 
  getFriends,
  getIncomingFriendRequests,
  deleteFriend,
  addFriendToAuth,
  declineFriendRequest,
} from '../actions/friendActions';

// react action types
import { DELETE_FRIEND } from '../actions/types';

// react components
import FriendsList from './FriendsList';
import AccountDashboard from './AccountDashboard';

/* this component is only meant to display the authenticated user's friends
within his/her account. A separate component should be used to display any 
user's friends */
function FriendsDashboard({ 
  auth, 
  getFriends,
  getIncomingFriendRequests,
  deleteFriend,
  addFriendToAuth,
  declineFriendRequest,
  errors,
}) {

  const dispatch = useDispatch();

  const handleAddFriend = (parentId) => {
    const body = {
      friendId: parentId
    };
    
    addFriendToAuth(body, auth.user.username);

    dispatch({
      type: DELETE_FRIEND,
      payload: {
        userId: auth.user.id,
        friendId: parentId
      }
    });
  };

  const handleDeleteFriend = (parentId) => {
    deleteFriend(auth.user, parentId);
  };

  const handleDeclineRequest = (parentId) => {
    declineFriendRequest(auth.user.username, parentId);

    dispatch({
      type: DELETE_FRIEND,
      payload: {
        userId: auth.user.id,
        friendId: parentId
      }
    });
  };

  const navItems = [
    {
      path: "/friends",
      props: {
        className: "dashboard-link sidebar-link hovered-link"
      },
      icon: FaUserFriends,
      heading: "All Friends"
    },
    {
      path: "/friends/requests",
      props: {
        className: "dashboard-link sidebar-link hovered-link"
      },
      icon: BsFillPersonPlusFill,
      heading: "Friend Requests"
    },
  ];

  const mainItems = [
    {
      path: "/friends",
      component: FriendsList,
      componentProps: {
        heading: "All Friends",
        getApiData: () => {
          getFriends(auth.user.username);
        },
        buttonItems: [
          {
            label: "Unfriend",
            function: handleDeleteFriend
          }
        ]
      }
    },
    {
      path: "/friends/requests",
      component: FriendsList,
      componentProps: {
        heading: "Friend Requests",
        getApiData: () => {
          getIncomingFriendRequests(auth.user.username);
        },
        buttonItems: [
          {
            label: "Accept",
            function: handleAddFriend
          },
          {
            label: "Decline",
            function: handleDeclineRequest,
            props: {
              className: "secondary-bg-color"
            }
          }
        ]
      }
    }
  ];

  return (
    <AccountDashboard heading="Friends" 
                      navItems={navItems} 
                      mainItems={mainItems}
                      className="friends-dashboard" />
  );
}

FriendsDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getFriends: PropTypes.func.isRequired,
  getIncomingFriendRequests: PropTypes.func.isRequired,
  deleteFriend: PropTypes.func.isRequired,
  addFriendToAuth: PropTypes.func.isRequired,
  declineFriendRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
    action: state.action
  };
};

const mapDispatchToProps = {
  getFriends,
  getIncomingFriendRequests,
  deleteFriend,
  addFriendToAuth,
  declineFriendRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsDashboard);
