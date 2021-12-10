import { mapArrayToObject } from '../utils/reduxMiddleware';
import { 
  ADD_FRIEND,
  DELETE_FRIEND,
  GET_FRIENDS,
} from "../actions/types";

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case GET_FRIENDS:
      const friendsObj = mapArrayToObject(payload);
      return friendsObj;

    case ADD_FRIEND:
      const newFriend = {};
      newFriend[payload.id] = payload;
    
      return {
        ...state,
        ...newFriend
      };

    case DELETE_FRIEND:
      const updatedState = {...state};
      delete updatedState[payload.userId];
      delete updatedState[payload.friendId];

      return updatedState;
    
    default:
      return state;
  }
}