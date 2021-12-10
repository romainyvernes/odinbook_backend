import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

// redux actions
import { enablePostForm } from '../actions/overlaysActions';

// stylesheets
import '../styles/AddPostSection.css';

function AddPostSection({ user, auth, enablePostForm }) {
  /* NOTE: if user is undefined, it implies the component is being used from
  the Newsfeed page, meaning the profile where the post is added is the 
  authenticated user's */
  
  const displayPostForm = () => {
    enablePostForm(null, user || auth.user);
  };

  return (
    <section className="add-post-section primary-frame primary-bg-color secondary-font-color">
      <button onClick={displayPostForm} 
              className="secondary-bg-color secondary-frame secondary-bg-color-hover">
        {
          !user || auth.user.id === user.id
            ? `What's on your mind?`
            : `Write something to ${user.first_name}...`
        }
      </button>
    </section>
  )
}

AddPostSection.propTypes = {
  auth: PropTypes.object.isRequired,
  enablePostForm: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { enablePostForm })(AddPostSection);
