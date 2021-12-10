import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import decodeHtml from '../utils/htmlDecoder';

// redux actions
import { updateComment } from '../actions/commentActions';

function EditCommentForm({ comment, updateComment, toggleEditComment }) {
  const [updatedComment, setUpdatedComment] = useState(comment);
  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  const onUpdateCommentChange = (e) => {
    const update = {...updatedComment};
    update.content = e.target.value;
    setUpdatedComment(update);
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();

    updateComment(updatedComment);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      toggleEditComment();
    }
  };

  return (
    <form onSubmit={handleUpdateComment} className="edit-comment-form">
      <div className="secondary-bg-color tertiary-frame">
        <input type="text" 
              placeholder={`Write a ${
                updatedComment.post_id === updatedComment.parent_id
                  ? 'comment'
                  : 'reply'
              }...`} 
              value={decodeHtml(updatedComment.content)}
              onChange={onUpdateCommentChange}
              onKeyDown={handleKeyPress}
              ref={input}
              required></input>
        <button type="submit" style={{ display: 'none' }}></button>
      </div>
      <p className="secondary-font-color left comment-btns">
        Press Esc to&nbsp;
        <button type="button" 
                onClick={toggleEditComment}
                className="primary-font-color">
          cancel
        </button>
      </p>
      
    </form>
  )
}

EditCommentForm.propTypes = {
  updateComment: PropTypes.func.isRequired
};

export default connect(null, { updateComment })(EditCommentForm);
