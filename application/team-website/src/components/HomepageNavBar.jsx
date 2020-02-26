import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';

export default class HomepageNavBar extends Component {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Pantry Raid</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Nav.Link href="/Team">Meet the Team</Nav.Link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Nav.Link href="/Login">Login/Signup</Nav.Link>
            </li>
          </ul>
          <p style={{color: 'white', align: 'right'}}>SFSU Software Engineering Project CSC 648-848, Fall 2019. For
            Demonstration Only.</p>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
