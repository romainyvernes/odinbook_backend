import { mapArrayToObject } from '../utils/reduxMiddleware';
import { 
  ADD_FRIEND_REQUEST, 
  ADD_FRIEND_TO_AUTH, 
  DELETE_FRIEND_FROM_AUTH, 
  DELETE_FRIEND_REQUEST, 
  USER_LOGIN, 
  USER_LOGOUT,
  UPDATE_USER,
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case USER_LOGIN:
      const authenticatedUser = {...payload};

      authenticatedUser.incomingFriendRequests = mapArrayToObject(
        authenticatedUser.incomingFriendRequests
      );

      authenticatedUser.outgoingFriendRequests = mapArrayToObject(
        authenticatedUser.outgoingFriendRequests
      );

      authenticatedUser.friends = mapArrayToObject(
        authenticatedUser.friends
      );
      
      return {
        ...state,
        isAuthenticated: payload.username ? true : false,
        user: authenticatedUser
      };

    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };

    case ADD_FRIEND_REQUEST:
      const newObj = {};
      newObj[payload.id] = payload;
      
      return {
        ...state,
        user: {
          ...state.user,
          outgoingFriendRequests: {
            ...state.user.outgoingFriendRequests,
            ...newObj
          }
        }
      };
    
    case DELETE_FRIEND_REQUEST:
      const updatedOutbound = {...state.user.outgoingFriendRequests};
      delete updatedOutbound[payload];

      const updatedInbound = {...state.user.incomingFriendRequests};
      delete updatedInbound[payload];
    
      return {
        ...state,
        user: {
          ...state.user,
          outgoingFriendRequests: updatedOutbound,
          incomingFriendRequests: updatedInbound
        }
      };

    case ADD_FRIEND_TO_AUTH:
      return {
        ...state,
        user: {
          ...state.user,
          friends: {
            ...state.user.friends,
            [payload.id]: payload
          }
        }
      };

    case DELETE_FRIEND_FROM_AUTH:
      const updatedFriends = {...state.user.friends};
      delete updatedFriends[payload];
    
      return {
        ...state,
        user: {
          ...state.user,
          friends: updatedFriends
        }
      };
    
    case UPDATE_USER:
      const { name, picture } = payload;
      return {
        ...state,
        user: {
          ...state.user,
          name,
          picture
        }
      };

    default:
      return state;
  }
}