/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { v4 as uuid } from 'uuid';

// redux action types
import { CLEAR_ACTION } from '../actions/types';

// stylesheet
import '../styles/FriendsList.css';

// bootstrap components
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function FriendsList({ 
  friends, 
  heading,
  getApiData,
  action,
  buttonItems,
}) {

  const dispatch = useDispatch();
  
  const [friendsArr, setFriendsArray] = useState([]);
  const loading = useRef(true);
  
  // store action object in redux state when component mounts to be able to
  // compare it with future changes
  const actionObj = useRef(action);

  useEffect(() => {
    getApiData();
  }, []);
  
  useEffect(() => {
    // detect when action creator above has updated redux store
    if (JSON.stringify(actionObj.current) !== JSON.stringify(action)) {
      loading.current = false;
      setFriendsArray(Object.keys(friends).map((key) => friends[key]));
      dispatch({ type: CLEAR_ACTION });
    }
  }, [action]);
  
  return (
    <>
      {
        loading.current
          ? <Spinner variant="primary" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          : <>
              <h2>{heading}</h2>
              <ul className="friends-list">
                {
                  friendsArr.length > 0
                    ? friendsArr.map((friend) => (
                        <li key={friend.username} 
                            className="septenary-frame primary-bg-color">
                          <a href={`/${friend.username}`} className="link-wrapper">
                            <img src={friend.picture.url} 
                                alt="user's profile avatar" />
                          </a>
                          <div className="bottom">
                            <a href={`/${friend.username}`}>
                              <h3 className="regular-bold">{friend.name}</h3>
                            </a>
                            {
                              buttonItems.map((button) => (
                                <Button key={uuid()} 
                                        {...button.props} 
                                        onClick={() => {
                                          button.function(friend.id);
                                        }}
                                        className="light-bold">
                                  {button.label}
                                </Button>
                              ))
                            }
                          </div>
                        </li>
                    ))
                    : <p>There is no one here.</p> 
                }
              </ul>
            </>
      }
    </>
  )
}

FriendsList.propTypes = {
  friends: PropTypes.object.isRequired,
  heading: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired,
  getApiData: PropTypes.func.isRequired,
  buttonItems: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  friends: state.friends,
  action: state.action,
})

export default connect(mapStateToProps)(FriendsList)
