import React, { useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, NavLink, Link } from 'react-router-dom';
import { logout } from '../actions/authActions';
import PropTypes from 'prop-types';
import axios from 'axios';

// stylesheet
import '../styles/Navbar.css';

// icons
import { 
  IoHomeOutline, 
  IoHomeSharp, 
  IoPeopleOutline, 
  IoPeopleSharp,
  IoLogOut,
} from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';

// bootstrap components
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';

// redux action types
import { GET_ERRORS } from '../actions/types';

function Navbar({ logout, history, auth }) {
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const loading = useRef(false);
  const searchInputEl = useRef();
  
  const onLogoutClick = () => {
    logout(history);
  };

  const handleSearchInputFocus = () => {
    setTimeout(() => {
      searchInputEl.current.focus();
    }, 250)
  };

  const handleSearch = (e) => {
    if (e.target.value !== '') {
      // display loading animation until API call is completed
      loading.current = true;

      axios.get(`/api/users?name=${e.target.value}`).then((response) => {
        loading.current = false;
        setSearchResults(response.data.slice(0, 8));
      }).catch((err) => {
        loading.current = false;
        dispatch({
          type: GET_ERRORS,
          payload: err.response
        });
      });
    } else {
      setSearchResults([]);
    }
  };

  const handleCloseDropdown = () => {
    // simulate click outside menu to trigger bootstrap built-in function
    document.querySelector('body').click();
  };
  
  return (
    <nav className="nav-bar primary-bg-color quinary-frame">
      <div className="search">
        <Link to="/">
          <i className="site-icon primary-font-color reg-display">Odinbook</i>
          <i className="site-icon tertiary-font-color tertiary-bg-color sm-display">
            0
          </i>
        </Link>
        <Dropdown className="search-btn">
          <Dropdown.Toggle>
            <i className="secondary-bg-color search-icon secondary-font-color"
            onClick={handleSearchInputFocus}>
              <AiOutlineSearch />
            </i>
          </Dropdown.Toggle>
          
          <Dropdown.Menu>
            <div className="top">
              <button className="return-btn secondary-font-color secondary-bg-color-hover"
                      onClick={handleCloseDropdown}>
                <i><BsArrowLeft /></i>
              </button>
              <input onChange={handleSearch} 
                    type="text" 
                    placeholder="Search Odinbook"
                    className="secondary-bg-color secondary-frame"
                    ref={searchInputEl} />
            </div>
            <ul>
              {
                loading.current
                  ? <Spinner variant="primary" animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  : searchResults.map((user) => (
                      <li key={user.id}>
                        <Dropdown.Item href={`/${user.username}`}>
                          <img src={user.picture.url} 
                                alt="user's profile avatar"
                                className="user-picture" />
                          <h6>{user.name}</h6>
                        </Dropdown.Item>
                      </li>
                    ))
              }
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <ul className="navigation-links">
        <li>
          <NavLink exact to="/" activeClassName="selected" className="nav-link hovered-link">
            <i className="icon outline"><IoHomeOutline /></i>
            <i className="icon filled"><IoHomeSharp /></i>
          </NavLink>
        </li>
        <li>
          <NavLink to="/friends" activeClassName="selected" className="nav-link hovered-link">
            <i className="icon outline"><IoPeopleOutline /></i>
            <i className="icon filled"><IoPeopleSharp /></i>
          </NavLink>
        </li>
      </ul>
      
      <div className="navigation-buttons">
        <Dropdown>
          <Dropdown.Toggle variant="secondary"></Dropdown.Toggle>
          
          <Dropdown.Menu variant="light">
            <ul>
              <li>
                <Dropdown.Item href={`/${auth.user.username}`} className="top-link hovered-link">
                  <img src={auth.user.picture.url} 
                        alt="user's profile avatar"
                        className="user-picture" />
                  <div>
                    <h2>{auth.user.name}</h2>
                    <p className="secondary-font-color">See your profile</p>
                  </div>
                </Dropdown.Item>
                <hr className="secondary-font-color" />
              </li>
              {
                auth.user.username !== 'guestuser'
                  && <li>
                      <Dropdown.Item href="/settings" className="dropdown-btn hovered-link">
                        <i><IoMdSettings /></i>
                        <h6>Settings</h6>
                      </Dropdown.Item>
                    </li>
              }
              <li>
                <Dropdown.Item onClick={onLogoutClick} className="dropdown-btn hovered-link">
                  <i><IoLogOut /></i>
                  <h6>Log out</h6>
                </Dropdown.Item>
              </li>
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, { logout })(withRouter(Navbar));
