import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//stylesheets
import '../styles/HomeSidebar.css';

// icons
import { IoPeopleCircleOutline } from 'react-icons/io5';

function Sidebar({ auth }) {
  return (
    <aside className="home-sidebar">
      <ul>
        <li>
          <Link to={`/${auth.user.username}`}
                className="hovered-link secondary-bg-color-hover sidebar-link">
            <img src={auth.user.picture.url} 
                 alt="user's profile avatar"
                 className="user-picture" />
            <h6>{auth.user.name}</h6>
          </Link>
        </li>
        <li>
          <Link to="/friends" 
                className="hovered-link secondary-bg-color-hover sidebar-link">
            <i className="primary-font-color"><IoPeopleCircleOutline /></i>
            <h6>Friends</h6>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Sidebar);
