import React from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SingUpForm';
import HomePageNav from '../components/HomepageNavBar';
import './Login.css';

class Login extends React.Component {

  state = {
    loginForm: true,
  };

  handleSignIn = (event) => {
    this.setState({loginForm: true});
  };

  handleSignUp = (event) => {
    this.setState({loginForm: false});
  };

  renderingForm = () => {
    if (this.state.loginForm) {
      return (
        <div>
          <HomePageNav/>
          <LoginForm signUp={this.handleSignUp}/>
        </div>
      )
    } else {
      return (
        <div>
          <HomePageNav/>
          <SignUpForm signIn={this.handleSignIn}/>
        </div>
      )
    }
  };

  render() {
    return (
      this.renderingForm()
    );
  }
}

export default Login
