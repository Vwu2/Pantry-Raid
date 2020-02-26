import React, {Component} from 'react';
import HomepageNavbar from '../components/HomepageNavBar';
import ReactPlayer from 'react-player'
import {Link} from 'react-router-dom';
import '../../node_modules/video-react/dist/video-react.css';
import "./Home.css";

class Homepage extends Component {
  render() {
    return (
      <div class="box">
        <HomepageNavbar/>

        <div>
          <ReactPlayer
            className="video-player"
            url='https://youtu.be/WxJrTQYDlsY'
            controls = {true}
            width="100%"
            height="100%"
          />
        </div>
        <div className="signButton" align='center'>
          <Link to="/Login" className="btn btn-primary">Sign up now!</Link>
        </div>
        <div className="appSummary" align="center">
          <h5>Pantry Raid is a smart refrigerator mobile application which allows users to manage, build, and keep track
            of their refrigerator
            inventory at all times. Alongside with tracking and managing inventory, Pantry Raid allows its users to
            upload and search for
            recipes throughout the application.
          </h5>
        </div>
      </div>
    );
  }
}

export default Homepage
