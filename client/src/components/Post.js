/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import decodeHtml from '../utils/htmlDecoder';

// redux actions
import { addReaction, deleteReaction } from '../actions/reactionActions';
import { deletePost } from '../actions/postActions';
import { enablePostForm } from '../actions/overlaysActions';

// redux action types
import { GET_ERRORS } from '../actions/types';

// stylesheets
import '../styles/Post.css';

// icons
import { FiThumbsUp } from 'react-icons/fi';
import { IoMdThumbsUp } from 'react-icons/io';
import { VscComment } from 'react-icons/vsc';

// components
import CommentsList from './CommentsList';
import AddCommentForm from './AddCommentForm';
import PrivateComponent from './PrivateComponent';
import LikeButton from './LikeButton';
import DropdownMenu from './DropdownMenu';

function Post({ 
  postIndex, 
  comments, 
  auth, 
  addReaction, 
  deleteReaction, 
  deletePost,
  posts,
  enablePostForm,
}) {
  const [commentsCount, setCommentsCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [enableComments, setEnableComments] = useState(true);
  const dispatch = useDispatch();

  const toggleLike = () => {
    // look for an existing reaction by authenticated user
    const currentReaction = posts[postIndex].reactions.find((reaction) => (
      reaction.author.id === auth.user.id
    ));
    
    if (currentReaction) {
      deleteReaction(currentReaction, posts[postIndex]);
    } else {
      const body = {
        parentId: posts[postIndex].id,
        profileId: posts[postIndex].destination_profile.id,
        value: 'Like'
      };
      
      addReaction(body, posts[postIndex]);
    }
  };

  const onCommentClick = () => {
    // when comment button is clicked, focus on comment input area
    setIsFocused(true);
  };

  const handleDeletePost = () => {
    deletePost(posts[postIndex]);
  };

  const handleUpdatePost = () => {
    enablePostForm(posts[postIndex]);
  };

  const disableAddCommentFocus = () => {
    setIsFocused(false);
  };

  const toggleCommentArea = () => {
    setEnableComments(!enableComments);
  };

  // upon component mount, retrieve count of all comments for the post
  useEffect(() => {
    axios.get(`/api/comments?postId=${posts[postIndex].id}`).then((response) => {
      setCommentsCount(response.data.length);
    }).catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    }); 
  }, [comments]);

  const dropdownItems = [
    {
      label: "Delete",
      function: handleDeletePost
    },
    {
      label: "Update",
      function: handleUpdatePost
    }
  ];
  
  return (
    <li className="post primary-frame primary-bg-color">
      <header>
        <div className="sub-header">
          <a href={`/${posts[postIndex].author.username}`} rel="author">
            <img src={posts[postIndex].author.picture.url} 
                alt="user's profile avatar"
                className="user-picture" />
          </a>
          <div>
            <a href={`/${posts[postIndex].author.username}`} rel="author">
              <h3>{posts[postIndex].author.name}</h3>
            </a>
            <time dateTime={posts[postIndex].date} className="post-date secondary-font-color">
              {new Date(posts[postIndex].date).toLocaleDateString(
                'en-US', { month: 'long', day: 'numeric', year: 'numeric' }
              )}
            </time>
          </div>
        </div>
        <PrivateComponent component={DropdownMenu} parent={posts[postIndex]} items={dropdownItems} />
      </header>

      <p className="post-content">{decodeHtml(posts[postIndex].content)}</p>

      <div className="post-data secondary-font-color">
        {
          <LikeButton reactions={posts[postIndex].reactions} 
                      hidden={posts[postIndex].reactions.length === 0} />
        }
        {
          commentsCount > 0 && 
            <button onClick={toggleCommentArea}>
              {`${commentsCount} Comment${commentsCount > 1 ? 's' : ''}`}
            </button>
        }
      </div>

      <div className="post-btns secondary-font-color light-bold">
        {
          posts[postIndex].reactions.find((reaction) => (
            reaction.author.id === auth.user.id
          ))
            ? <button onClick={toggleLike} className="primary-font-color post-btn hovered-link">
                <i><IoMdThumbsUp /></i>
                <span>Unlike</span>
              </button>
            : <button onClick={toggleLike} className="post-btn hovered-link">
                <i><FiThumbsUp /></i>
                <span>Like</span>
              </button>
        }
        <button onClick={onCommentClick} className="post-btn hovered-link">
          <i><VscComment /></i>
          <span>Comment</span>
        </button>
      </div>
      
      {
        // list of comments
        enableComments
         ? comments[posts[postIndex].id]?.length > 0
            ? <CommentsList comments={comments[posts[postIndex].id].filter((comment) => (
              comment.parent_id === posts[postIndex].id
            ))} />
            : <p className="no-data-msg">Be the first to comment.</p>
         : null
      }

      {
        enableComments
          ? <AddCommentForm type="comment" 
                            parentId={posts[postIndex].id} 
                            profileId={posts[postIndex].destination_profile.id}
                            postId={posts[postIndex].id}
                            isFocused={isFocused}
                            disableAddCommentFocus={disableAddCommentFocus} />
          : null
      }
    </li>
  );
}

Post.propTypes = {
  comments: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addReaction: PropTypes.func.isRequired,
  deleteReaction: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  enablePostForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  comments: state.comments,
  auth: state.auth,
  posts: state.posts
});

export default connect(mapStateToProps, {
  addReaction,
  deleteReaction,
  deletePost,
  enablePostForm,
})(Post);
