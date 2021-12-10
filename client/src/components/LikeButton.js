import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// stylesheets
import '../styles/LikeButton.css';

// icons
import { FaThumbsUp } from 'react-icons/fa';

// redux actions
import { enableReactionsList } from '../actions/overlaysActions';

function LikeButton({ 
  reactions, 
  enableReactionsList, 
  hidden, 
  posts, 
  comments 
}) {
  // NOTE: posts and comments props is required to trigger re-render of 
  // reactions count

  const displayReactionsList = () => {
    enableReactionsList(reactions);
  };
  
  return (
    <button className="like-button" 
            onClick={displayReactionsList}
            style={hidden ? { visibility: 'hidden' } : {}}>
      <i className="primary-font-color"><FaThumbsUp /></i>
      <span className="secondary-font-color"> {reactions.length}</span>
    </button>
  )
}

LikeButton.propTypes = {
  enableReactionsList: PropTypes.func.isRequired,
  reactions: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  comments: state.comments,
});

export default connect(mapStateToProps, { enableReactionsList })(LikeButton);
