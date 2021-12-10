import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// redux actions
import { addComment } from '../actions/commentActions';

// stylesheet
import '../styles/AddCommentForm.css';

function AddCommentForm({ 
  type, 
  parentId, 
  postId, 
  profileId, 
  comments, 
  addComment,
  isFocused,
  disableAddCommentFocus,
  auth,
}) {
  // "type" variable in props should either be "comment" if the comment is
  // directly under a post, or "reply" if it is a reply to an existing comment
  // console.log(postId + ': ' + isFocused)
  const [commentContent, setCommentContent] = useState('');
  const commentInputEl = useRef();

  useEffect(() => {
    setCommentContent('');
  }, [comments]);

  useEffect(() => {
    if (isFocused) {
      commentInputEl.current.focus();
    }
  }, [isFocused]);

  const onAddCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    
    const body = {
      parentId,
      profileId,
      postId,
      content: commentContent
    };

    addComment(body);
  };

  return (
    <form onSubmit={handleAddComment} className="add-comment-form">
      <a href={`/${auth.user.username}`} rel="author" className="left">
        <img src={auth.user.picture.url} 
            alt="user's profile avatar"
            className="user-picture" />
      </a>
      <div className="secondary-bg-color secondary-frame right">
        <input type="text" 
                placeholder={`Write a ${type}...`} 
                value={commentContent}
                onChange={onAddCommentChange}
                onBlur={disableAddCommentFocus}
                ref={commentInputEl}
                required></input>
        <button type="submit" style={{ display: 'none' }}></button>
      </div>
    </form>
  )
}

AddCommentForm.propTypes = {
  comments: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  comments: state.comments,
  auth: state.auth
});

export default connect(mapStateToProps, { addComment })(AddCommentForm);
