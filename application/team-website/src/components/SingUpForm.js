import React from 'react';

import {Button, Form} from 'react-bootstrap'
import {Route} from 'react-router-dom';
import Login from '../pages/Login'
import './SingUpForm.css'

class SignUpForm extends React.Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    pass1: '',
    pass2: '',
    validAccountCreation: false,
    failedAccountCreation: false,
    errorMessage: ''
  };

  //post create account
  //create the user if valid account returns true
  handleCreateAccount = () => {
    if (this.validAccountCredentials()) {
      const req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.response === 'success') {
          this.setState({validAccountCreation: true});
        } else if (this.response === 'user exists') {
          this.setState({
            failedAccountCreation: true,
            errorMessage: 'A User With that Email Already Exists'
          });
        }
      };

      const formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('password', this.state.pass1);
      formData.append('first_name', this.state.firstName);
      formData.append('last_name', this.state.lastName);

      req.open('POST', 'http://cryptoflipit.com/backend/register');
      req.send(formData);
    } else {
      // It shouldn't be possible to get here
      this.setState({
        failedAccountCreation: true,
        errorMessage: 'Incorrect Password or Empty Inputs'
      });
    }
  };

  validAccountCredentials = () => {
    return (this.validPassword() && this.validUser());
  };

  validPassword = () => {
    return (this.state.pass1 === this.state.pass2 && this.state.pass1 !== '')
  };

  validUser = () => {
    return (this.state.firstName !== '' && this.state.lastName !== '' && this.state.email !== '')
  };

  render() {
    if (this.state.validAccountCreation) {
      return (
        <Route exact path='/Login' component={Login}/>
      );
    }
    return (
      <div className='sign-up-form'>
        <Form>
          <h1 className='text-center'>
            <span className='font-weight-bold '>Pantry Raid</span>
          </h1>
          <pre><h2 className='text-center'>{this.state.errorMessage}</h2></pre>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type='first name'
              placeholder='Enter First Name'
              onChange={(event) => this.setState({firstName: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type='last name'
              placeholder='Enter Last Name'
              onChange={(event) => this.setState({lastName: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              onChange={(event) => this.setState({email: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              onChange={(event) => this.setState({pass1: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              onChange={(event) => this.setState({pass2: event.target.value})}/>
          </Form.Group>

          <Button
            variant='primary'
            className='mt-3 btn-lg btn-block btn-dark'
            //disabled={!this.validAccountCredentials()} // TODO: Why doesn't this do anything?
            onClick={this.handleCreateAccount}>
            Create Account
          </Button>

          <p className='mt-3'>Already have an account?</p>
          <Button
            variant='primary'
            className='btn-lg btn-block'
            onClick={this.props.signIn}>
            Sign in
          </Button>
        </Form>
      </div>
    );
  }
}


export default SignUpForm;