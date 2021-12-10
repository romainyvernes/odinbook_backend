/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { v4 as uuid } from 'uuid';
import axios from 'axios';

// stylesheet
import '../styles/AccountInfo.css';

// redux action types
import { GET_ERRORS } from '../actions/types';

// react components
import AccountInfoItem from './AccountInfoItem'

function AccountInfo({ heading, auth }) {
  const dispatch = useDispatch();
  const [infoItems, setInfoItems] = useState([]);
  
  useEffect(() => {
    axios.get(`/api/users/${auth.user.username}?accountInfo=true`)
         .then((response) => {
            setInfoItems([
              {
                heading: "Name",
                content: {
                  name: response.data.name,
                  firstName: response.data.first_name,
                  lastName: response.data.last_name
                },
                btnLabel: "Edit"
              },
              {
                heading: "Email address",
                content: response.data.email,
                btnLabel: "Edit"
              },
              {
                heading: "Password",
                content: "",
                btnLabel: "Update"
              },
              {
                heading: "Account management",
                btnLabel: "View"
              },
            ]);
         }).catch((err) => {
          dispatch({
            type: GET_ERRORS,
            payload: err.response
          });
        });
  }, []);
  
  return (
    <>
      <h2>{heading}</h2>
      <ul className="account-info-list">
        {
          infoItems.map((item) => (
            <AccountInfoItem heading={item.heading}
                              content={item.content}
                              btnLabel={item.btnLabel}
                              key={uuid()} />
          ))
        }
      </ul>
    </>
  )
}

AccountInfo.propTypes = {
  heading: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AccountInfo)
