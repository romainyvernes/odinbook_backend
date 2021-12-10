import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function PrivateComponent({ auth, parent, component: Component, ...rest }) {
  return (
    <>
      {
        auth.user.id === parent.author.id 
        || auth.user.id === parent.destination_profile
          ? <Component {...rest} />
          : null
      }
    </>
  )
}

PrivateComponent.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateComponent);
