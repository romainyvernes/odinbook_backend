/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// redux actions
import { login } from '../../actions/authActions';

// bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// redux actions
import { enableSignupForm } from "../../actions/overlaysActions";

// stylesheet
import '../../styles/Login.css';

function Login({ auth, errors, login, history, enableSignupForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // check whether user appears as logged in when component is mounted
  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push('/');
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      email,
      password
    };

    login(body);
  };

  const handleLoginAsGuest = () => {
    const body = {
      email: "guestuser@test.com",
      password: "guestuser"
    };

    login(body);
  };

  return (
    <div className="login">
      <h1 className="site-name primary-font-color">odinbook</h1>
      <section className="primary-frame primary-bg-color">
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group>
            <Form.Control type="text" 
                          name="email"
                          placeholder="Email"
                          value={email} 
                          onChange={onChange}
                          isInvalid={errors?.data?.email} />
            <Form.Control.Feedback type="invalid">
              {errors?.data?.email?.msg}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" 
                          name="password"
                          placeholder="Password"
                          value={password}
                          onChange={onChange}
                          isInvalid={errors?.data?.password} />
            <Form.Control.Feedback type="invalid">
              {errors?.data?.password?.msg}
            </Form.Control.Feedback>
          </Form.Group>
          <button className="tertiary-bg-color tertiary-font-color validation-btn"
                  type="submit">
            Log In
          </button>
        </Form>

        <button className="tertiary-bg-color tertiary-font-color validation-btn guest-btn"
                onClick={handleLoginAsGuest}>
          Log In As Guest
        </button>

        <hr />

        <div className="signup-wrapper">
          <Button className="signup-btn" 
                  variant="success" 
                  onClick={enableSignupForm}>
            Create new account
          </Button>
        </div>
      </section>
    </div>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  enableSignupForm: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { 
  login, 
  enableSignupForm 
})(withRouter(Login));