import React, {Component} from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {Redirect} from "react-router-dom";
import {withCookies} from "react-cookie";

class PantryRaidNavBar extends Component {
  state = {
    signedOut: false
  };

  handleSignOut = () => {
    const {cookies} = this.props;
    cookies.remove('session');
    cookies.remove('session_sig');
    this.setState({needLogin: true})
  };

  render() {
    if (this.state.signedOut === true) {
      return (
        <Redirect to={{pathname: '/'}}/>
      );
    }

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Pantry Raid</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/Inventory">Inventory</Nav.Link>
            <Nav.Link href="/Recipes">Recipes</Nav.Link>
            <Nav.Link href="/ShoppingList">Shopping List</Nav.Link>
            <Nav.Link href="/MealPlan">Meal Plan</Nav.Link>
            <Nav.Link onClick={this.handleSignOut}>Sign Out</Nav.Link>
          </Nav>
          <p style={{color: 'white', align: 'right'}}>SFSU Software Engineering Project CSC 648-848, Fall 2019. For
            Demonstration Only.</p>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

export default withCookies(PantryRaidNavBar);
