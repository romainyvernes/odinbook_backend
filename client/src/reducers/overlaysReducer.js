import { 
  ENABLE_POST_FORM, 
  DISABLE_POST_FORM,
  ENABLE_REACTIONS_LIST,
  DISABLE_REACTIONS_LIST,
  ENABLE_SIGNUP_FORM,
  DISABLE_SIGNUP_FORM,
  ENABLE_UPLOAD_PICTURE,
  DISABLE_UPLOAD_PICTURE
} from "../actions/types";

const initialState = {
  postForm: {
    isEnabled: false,
    profile: {}
  },
  reactionsList: {
    isEnabled: false,
    reactions: []
  },
  signupForm: {
    isEnabled: false
  },
  uploadPicture: {
    isEnabled: false
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case ENABLE_POST_FORM:
      if (payload?.post?.id) { // implies a post was passed in
        return {
          ...state,
          postForm: {
            isEnabled: true,
            post: payload.post,
            profile: payload.post.destination_profile
          }
        };
      } else { // imples a new post is being created
        return {
          ...state,
          postForm: {
            isEnabled: true,
            profile: payload.profile
          }
        };
      }

    case DISABLE_POST_FORM:
      return {
        ...state,
        postForm: {
          isEnabled: false,
          profile: {}
        }
      };

    case ENABLE_REACTIONS_LIST:
      return {
        ...state,
        reactionsList: {
          isEnabled: true,
          reactions: payload
        }
      };

    case DISABLE_REACTIONS_LIST:
      return {
        ...state,
        reactionsList: {
          isEnabled: false,
          reactions: []
        }
      };

    case ENABLE_SIGNUP_FORM:
      return {
        ...state,
        signupForm: {
          isEnabled: true
        }
      };

    case DISABLE_SIGNUP_FORM:
      return {
        ...state,
        signupForm: {
          isEnabled: false
        }
      };

    case ENABLE_UPLOAD_PICTURE:
      return {
        ...state,
        uploadPicture: {
          isEnabled: true
        }
      };

    case DISABLE_UPLOAD_PICTURE:
      return {
        ...state,
        uploadPicture: {
          isEnabled: false
        }
      };
      
    default:
      return state;
  }
}