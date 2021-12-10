import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// bootstrap components
import Modal from 'react-bootstrap/Modal';

// stylesheet
import '../styles/ReactionsList.css';

function ReactionsList({ overlays }) {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as={"h2"}>Likes</Modal.Title>
      </Modal.Header>
      <Modal.Body as={'ul'} className="reactions-list">
        {
          overlays.reactionsList.reactions.map((reaction) => (
            <li key={reaction._id}>
              <div className="user">
                <a href={`/${reaction.author.username}`}>
                  <img src={reaction.author.picture.url} 
                        alt="user's profile avatar"
                        className="user-picture" />
                </a>
                <a href={`/${reaction.author.username}`}>
                  <h3>{reaction.author.name}</h3>
                </a>
              </div>
            </li>
          ))
        }
      </Modal.Body>
    </>
  )
}

ReactionsList.propTypes = {
  overlays: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  overlays: state.overlays
});

export default connect(mapStateToProps)(ReactionsList);
