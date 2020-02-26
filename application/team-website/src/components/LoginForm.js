import React from 'react';
import './LoginForm.css';
import {withCookies} from 'react-cookie';
import {Button, Form} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

class LoginForm extends React.Component {
  state = {
    email: "",
    pass: "",
    authenticated: false,
    errorMessage: ''
  };

  handleSignIn = () => {
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        // console.log(`login response: {${req.response}}`);
        if (req.response === 'failure') {
          this.failedInfoStateChange();
        } else {
          try {
            const response = JSON.parse(req.response);
            const session = response.session;
            const session_sig = response.session_sig;
            const expiration = new Date(session.expiration * 1000);

            const {cookies} = this.props;
            cookies.set('session', JSON.stringify(session), {expires: expiration});
            cookies.set('session_sig', session_sig, {expires: expiration});

            this.setState({authenticated: true});
          } catch (e) {
            console.log(`invalid JSON:\n${req.response}`);
          }
        }
      }
    };


    const formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('password', this.state.pass);

    req.open('POST', 'http://cryptoflipit.com/backend/login');
    req.send(formData);
  };


  failedInfoStateChange = () => {
    this.setState({
      errorMessage: 'Incorrect Email/Password\nPlease Try Again'
    });
  };

  render() {
    if (this.state.authenticated === true) {
      return <Redirect to={{
        pathname: '/MealPlan'
      }}/>
    }
    return (
      <div className="login-form">
        <Form>
          <h1 className="text-center">
            <span className="font-weight-bold ">Pantry Raid</span>
          </h1>
          <pre><h2 className="text-center">{this.state.errorMessage}</h2></pre>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(event) => this.setState({email: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => this.setState({pass: event.target.value})}/>
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out"/>
          </Form.Group>

          <Button variant="primary" className="btn-lg btn-dark btn-block" onClick={this.handleSignIn}>
            Log in
          </Button>
          <Button variant="primary" className="mt-3 btn-lg btn-block" onClick={this.props.signUp}>
            Sign Up
          </Button>
        </Form>
      </div>
    );
  }

}

export default withCookies(LoginForm);
