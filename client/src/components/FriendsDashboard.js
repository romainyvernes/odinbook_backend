/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
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
  addFriend,
  declineFriendRequest,
} from '../actions/friendActions';

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
  addFriend,
  declineFriendRequest,
}) {

  const handleAddFriend = (parentId) => {
    const body = {
      friendId: parentId
    };
    
    addFriend(body, auth.user.username);
  };

  const handleDeleteFriend = (parentId) => {
    deleteFriend(auth.user, parentId);
  };

  const handleDeclineRequest = (parentId) => {
    declineFriendRequest(auth.user.username, parentId);
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
  addFriend: PropTypes.func.isRequired,
  declineFriendRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  getFriends,
  getIncomingFriendRequests,
  deleteFriend,
  addFriend,
  declineFriendRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsDashboard);
