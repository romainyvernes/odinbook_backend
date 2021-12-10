import { CLEAR_ACTION, GET_ACTION } from '../actions/types';

const initialState = {
  type: "",
  payload: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case GET_ACTION:
      return payload;

    case CLEAR_ACTION:
      return {
        type: "",
        payload: null
      };
    
    default:
      return state;
  }
}