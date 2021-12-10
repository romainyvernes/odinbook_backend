/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import decodeHtml from '../utils/htmlDecoder';

// bootstrap components
import Modal from 'react-bootstrap/Modal';

// stylesheets
import '../styles/PostForm.css';

// redux actions
import { updatePost, addPost } from '../actions/postActions';
import { disablePostForm } from '../actions/overlaysActions';

// redux action types
import { CLEAR_ACTION } from '../actions/types';

function PostForm({  
  updatePost, 
  auth, 
  addPost,
  disablePostForm,
  overlays: { postForm, ...otherKeys},
  action,
}) {

  const [postContent, setPostContent] = useState(postForm?.post?.content || '');
  const submitBtn = useRef();
  const dispatch = useDispatch();

  // store action object in redux state when component mounts to be able to
  // compare it with future changes
  const actionObj = useRef(action);

  useEffect(() => {
    if (postContent === '') {
      submitBtn.current.disabled = true;
    } else {
      submitBtn.current.disabled = false;
    }
  }, [postContent]);

  const onContentChange = (e) => {
    setPostContent(e.target.value);
  };

  useEffect(() => {
    // detect when action creator above has updated redux store
    if (JSON.stringify(actionObj.current) !== JSON.stringify(action)) {
      /* once new post creation is confirmed, disable post form, which will
      trigger re-render of parent component (Newsfeed.js/Profile.js) where
      getPosts is called */
      disablePostForm();
      
      dispatch({ type: CLEAR_ACTION });
    }
  }, [action]);

  const handlePostSubmit = (e) => {
    e.preventDefault();

    if (postForm.post) { // implies post already exists in DB
      const updatedPost = {...postForm.post};
      updatedPost.content = postContent;
      updatePost(updatedPost);
    } else {
      const body = {
        profileId: postForm.profile.id,
        content: postContent
      };

      addPost(body);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as={"h2"}>
          {`${postForm.post ? 'Edit' : 'Create'} Post`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as={"form"} onSubmit={handlePostSubmit} className="post-form">
        <div className="user">
          <a href={`/${auth.user.username}`} rel="author" className="left">
            <img src={auth.user.picture.url} 
                alt="user's profile avatar"
                className="user-picture" />
          </a>
          <h3>{auth.user.name}</h3>
        </div>
        <textarea type="text" 
                placeholder={
                  postForm.profile.id === auth.user.id
                    ? `What's on your mind?`
                    : `Write something to ${postForm.profile.first_name}...`
                }
                value={decodeHtml(postContent)}
                onChange={onContentChange}
                required></textarea>
        <button ref={submitBtn} 
                type="submit" 
                className="tertiary-bg-color tertiary-font-color validation-btn" 
                disabled>
          {postForm.post ? 'Save' : 'Post'}
        </button>
      </Modal.Body>
    </>
  )
}

PostForm.propTypes = {
  updatePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  overlays: PropTypes.object.isRequired,
  disablePostForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  overlays: state.overlays,
  action: state.action,
});

export default connect(mapStateToProps, { 
  updatePost, 
  addPost,
  disablePostForm,
})(PostForm);
