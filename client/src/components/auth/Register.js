import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// redux actions
import { register } from '../../actions/authActions';

// bootstrap components
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// stylesheet
import '../../styles/Register.css';

function Register({ auth, errors, register, history }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // check whether user appears as logged in when component is mounted
  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'first-name':
        setFirstName(value);
        break;
      case 'last-name':
        setLastName(value);
        break;
      default:
        return;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      username,
      password,
      email,
      firstName,
      lastName
    };

    register(body, history);
  };
  
  return (
    <>
      <Modal.Header closeButton>
        <div>
          <Modal.Title as={"h2"}>Sign Up</Modal.Title>
          <p>It's quick and easy.</p>
        </div>
      </Modal.Header>
      <Modal.Body as={"form"} onSubmit={handleSubmit} className="signup-form">
        <Form.Group>
          <Form.Control type="text" 
                        name="first-name"
                        placeholder="First name"
                        value={firstName}
                        onChange={onChange}
                        isInvalid={errors?.data?.firstName} />
          <Form.Control.Feedback type="invalid">
            {errors?.data?.firstName?.msg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Control type="text" 
                        name="last-name"
                        placeholder="Last name"
                        value={lastName}
                        onChange={onChange}
                        isInvalid={errors?.data?.lastName} />
          <Form.Control.Feedback type="invalid">
            {errors?.data?.lastName?.msg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Control type="text" 
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={onChange}
                        isInvalid={errors?.data?.username} />
          <Form.Control.Feedback type="invalid">
            {errors?.data?.username?.msg}
          </Form.Control.Feedback>
        </Form.Group>
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
        <Button className="signup-btn" variant="success" type="submit">
          Sign Up
        </Button>
      </Modal.Body>
    </>
  )
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors,
  };
};

const mapDispatchToProps = {
  register,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));
