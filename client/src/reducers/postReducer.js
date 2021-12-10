import { 
  ADD_POST,
  ADD_POST_REACTION, 
  DELETE_POST, 
  DELETE_POST_REACTION, 
  GET_POSTS, 
  RESET_POSTS, 
  UPDATE_POST
} from "../actions/types";

const initialState = [];

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case GET_POSTS:
      return payload;

    case ADD_POST_REACTION:
      return state.reduce((newArr, post) => {
        if (post.id === payload.post.id) {
          post.reactions.push(payload.reaction);
        }
        newArr.push(post);
        return newArr;
      }, []);
    
    case DELETE_POST_REACTION:
      return state.reduce((newArr, post) => {
        if (post.id === payload.post.id) {
          post.reactions = post.reactions.filter((reaction) => (
            reaction._id !== payload.reaction._id
          ));
        }
        newArr.push(post);
        return newArr;
      }, []);

    case DELETE_POST:
      return state.reduce((newArr, post) => {
        if (post.id !== payload.id) {
          newArr.push(post);
        }
        
        return newArr;
      }, []);

    case UPDATE_POST:
      return state.reduce((newArr, post) => {
        if (post.id === payload.id) {
          post.content = payload.content;
        }
        newArr.push(post);
        return newArr;
      }, []);

    case ADD_POST:
      return [
        payload,
        ...state
      ];

    case RESET_POSTS:
      return [];

    default:
      return state;
  }
}