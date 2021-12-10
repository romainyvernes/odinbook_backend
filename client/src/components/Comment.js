import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import decodeHtml from '../utils/htmlDecoder';

// redux actions
import { deleteComment, loadComments } from '../actions/commentActions';
import { addReaction, deleteReaction } from '../actions/reactionActions';

// stylesheets
import '../styles/Comment.css';

// icons
import { BsArrowReturnRight } from 'react-icons/bs';

// import components
import CommentsList from './CommentsList';
import AddCommentForm from './AddCommentForm';
import EditCommentForm from './EditCommentForm';
import DropdownMenu from './DropdownMenu';
import PrivateComponent from './PrivateComponent';
import LikeButton from './LikeButton';

function Comment({ 
  data, 
  comments, 
  deleteComment, 
  auth, 
  addReaction, 
  deleteReaction,
  loadComments
}) {
  const comment = useRef(data);
  const [enableAddComment, setEnableAddComment] = useState(false);
  const [enableEditComment, setEnableEditComment] = useState(false);

  useEffect(() => {
    // when there are changes to the comments object, hide "edit reply" input 
    // from display
    setEnableEditComment(false);
  }, [comments]);
  
  const toggleLike = () => {
    // look for an existing reaction by authenticated user
    const currentReaction = data.reactions.find((reaction) => (
      reaction.author.id === auth.user.id
    ));
    
    if (currentReaction) {
      deleteReaction(currentReaction, comment.current);
    } else {
      const body = {
        parentId: comment.current.id,
        profileId: comment.current.destination_profile,
        value: 'Like'
      };

      addReaction(body, comment.current);
    }
  };

  const onReplyClick = () => {
    // when reply button is clicked, "new reply" input should appear
    setEnableAddComment(true);
  };

  const handleLoadComments = () => {
    loadComments(comment.current.id);
  };

  const handleDeleteComment = () => {
    deleteComment(comment.current);
  };

  const toggleEditComment = () => {
    if (enableEditComment) {
      setEnableEditComment(false);
    } else {
      setEnableEditComment(true);
    }
  };

  let repliesDisplayed = [];
  
  // match comment's replies with their counterparts in redux state. If there 
  // is no match, the comment was never loaded
  if (data.replies.length > 0 && comments[data.post_id].length > 0) {
    repliesDisplayed = comments[data.post_id].filter((comment) => {
      for (let reply of data.replies) {
        if (reply.id === comment.id) {
          return true;
        }
      }
      return false;
    });
  }

  const dropdownItems = [
    {
      label: "Delete",
      function: handleDeleteComment
    },
    {
      label: "Update",
      function: toggleEditComment
    }
  ];
  
  return (
    <li className={`comment${enableEditComment ? ' edit' : ''}`}>
      {
        // toggle between display to edit a comment and display to view a
        // comment
        enableEditComment
          ? <EditCommentForm comment={comment.current} 
                            toggleEditComment={toggleEditComment} />
          : <div className="sub-wrapper">
              <div className="sub-sub-wrapper">
                <a href={`/${data.author.username}`} rel="author">
                  <img src={data.author.picture.url} 
                      alt="user's profile avatar"
                      className="user-picture" />
                </a>
                <div className="comment-main secondary-bg-color tertiary-frame">
                  <a href={`/${data.author.username}`} rel="author">
                    <h4>{data.author.name}</h4>
                  </a>
                  <p>{decodeHtml(data.content)}</p>
                  {
                    <LikeButton reactions={data.reactions} 
                                hidden={data.reactions.length === 0} />
                  }
                </div>
                <PrivateComponent component={DropdownMenu} parent={data} items={dropdownItems} />
              </div>
              <div className="comment-btns secondary-font-color">
                <div className="left light-bold">
                  {
                    // adapt like button display based on whether authenticated
                    // user has already liked the comment
                    data.reactions.find((reaction) => (
                      reaction.author.id === auth.user.id
                    ))
                      ? <button onClick={toggleLike} 
                                className="primary-font-color">
                          Unlike
                        </button>
                      : <button onClick={toggleLike}>Like</button>
                  }
                  <i>&middot;</i>
                  <button onClick={onReplyClick}>Reply</button>
                </div>
                <i>&middot;</i>
                <button className="comment-date reg-display">
                  <time dateTime={data.date}>
                  {new Date(data.date).toLocaleDateString(
                    'en-US', { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                  </time>
                </button>
              </div>
            </div>
      }
      {
        // if a comment has replies but the user has never asked to display
        // them before, a "load replies" button should appear instead 
        data.replies.length > 0
          && repliesDisplayed.length < data.replies.length
          && (
            <div className="more-comments-btn light-bold secondary-font-color">
              <BsArrowReturnRight className="arrow-icon" />
              <button onClick={handleLoadComments}>
                View {data.replies.length - repliesDisplayed.length} more {
                  data.replies.length - repliesDisplayed.length > 1 
                    ? 'replies' 
                    : 'reply'
                }
              </button>
            </div>
        )
      }
      {
        // if there are replies to display, display them as a list
        repliesDisplayed.length > 0 && (
          <CommentsList comments={repliesDisplayed} />
        )
      }
      {
        // display input to write new reply when enableAddComment is true
        enableAddComment && (
          <AddCommentForm type="reply" 
                          parentId={data.id} 
                          profileId={data.destination_profile}
                          postId={data.post_id} />
        )
      }
    </li>
  );
}

Comment.propTypes = {
  comments: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  addReaction: PropTypes.func.isRequired,
  deleteReaction: PropTypes.func.isRequired,
  loadComments: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  comments: state.comments,
  auth: state.auth
});

export default connect(mapStateToProps, { 
  deleteComment,
  addReaction,
  deleteReaction,
  loadComments
})(Comment);
