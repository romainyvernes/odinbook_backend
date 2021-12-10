import { 
  GET_COMMENTS, 
  ADD_COMMENT, 
  DELETE_COMMENT, 
  UPDATE_COMMENT,
  ADD_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
  MAP_POST_TO_COMMENTS,
  UNMAP_POST_TO_COMMENTS,
  RESET_COMMENTS
} from "../actions/types";

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, { type, payload }) {
  switch(type) {
    case GET_COMMENTS:
      return payload;
    
    case ADD_COMMENT:
      const newStateArr = [...state[payload[0].post_id]];
    
      // eslint-disable-next-line array-callback-return
      payload.map((newComment) => {
        
        // add new comment to its parent comment when it is a reply to a comment
        if (newComment.post_id !== newComment.parent_id) {
          // look for the new comment's parent comment and add it to
          // parent's replies
          for (let comment of newStateArr) {
            if (comment.id === newComment.parent_id) {
              // check whether new comment is already in its parent's replies
              const index = comment.replies.findIndex((reply) => (
                reply.id === newComment.id
              ));

              if (index > -1) { // implies comment was found
                comment.replies[index] = newComment;

                // remove existing comment from state to preserve comments order
                for (let i = 0; i < newStateArr.length; i++) {
                  if (newStateArr[i].id === newComment.id) {
                    newStateArr.splice(i, 1);
                    break;
                  }
                }
              } else {
                comment.replies.push(newComment);
              }
              
              break;
            }
          }
        }

        // insert the new comment at the end of comments array in state
        newStateArr.push(newComment);
      });

      return {
        ...state,
        [newStateArr[0].post_id]: newStateArr
      };
    
    case DELETE_COMMENT:
      const deletedComment = payload;

      // remove deleted comment from its parent comment's replies if it is a 
      // reply to a comment
      if (deletedComment.post_id !== deletedComment.parent_id) {
        return {
          ...state,
          [deletedComment.post_id]: state[deletedComment.post_id].reduce(
            (newArr, comment) => {
              // save only comments that are not the deleted comment
              if (comment.id !== deletedComment.id) {
                newArr.push(comment);
              }

              // look for the deleted comment's parent comment and remove it
              // from the parent comment's replies array
              if (comment.id === deletedComment.parent_id) {
                comment.replies = comment.replies.filter((comment) => (
                  comment.id !== deletedComment.id
                ));
              }
              
              return newArr;
            }, 
            []
          )
        };
      }

      // otherwise, only save comments that aren't the deleted comment
      return {
        ...state,
        [deletedComment.post_id]: state[deletedComment.post_id].filter(
          (comment) => comment.id !== deletedComment.id
        )
      };

    case UPDATE_COMMENT:
      const updatedComment = payload;
      return {
        ...state,
        [updatedComment.post_id]: state[updatedComment.post_id].map(
          (comment) => {
            if (comment.id === updatedComment.id) {
              comment.content = updatedComment.content;
            }
            return comment;
          }
        )
      };
    
    case ADD_COMMENT_REACTION:
      const { comment, reaction } = payload;
      return {
        ...state,
        [comment.post_id]: state[comment.post_id].map(
          (item) => {
            if (item.id === comment.id) {
              item.reactions.push(reaction);
            }
            return item;
          }
        )
      };

    case DELETE_COMMENT_REACTION:
      return {
        ...state,
        [payload.comment.post_id]: state[payload.comment.post_id].map(
          (item) => {
            if (item.id === payload.comment.id) {
              item.reactions = item.reactions.filter((element) => (
                element._id !== payload.reaction._id
              ));
            }
            return item;
          }
        )
      };

    case MAP_POST_TO_COMMENTS:
      return {
        ...state,
        [payload.id]: []
      };

    case UNMAP_POST_TO_COMMENTS:
      const newState = {...state};
      delete newState[payload.id];
    
      return newState;

    case RESET_COMMENTS:
      return {};

    default:
      return state;
  }
}