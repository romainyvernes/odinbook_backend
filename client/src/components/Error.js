/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';

// redux action type
import { CLEAR_ERRORS } from '../actions/types';

// stylesheet
import '../styles/Error.css';

function Error({ errors }) {
  const dispatch = useDispatch();
  const currentError = useRef(errors);

  useEffect(() => {
    dispatch({
      type: CLEAR_ERRORS
    });
  }, []);
  
  return (
    <div className="error">
      <h1>An Error Has Occurred</h1>
      <p>{currentError.current?.message}</p>
    </div>
  )
}

const mapStateToProps = (state) => ({ 
  errors: state.errors,
});

export default connect(mapStateToProps)(Error);
