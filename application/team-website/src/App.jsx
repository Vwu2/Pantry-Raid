import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css'
import Inventory from './pages/Inventory.jsx';
import Meeting_Notes from './pages/Meetings/Meeting_Notes';
import PrivateRoute from './components/PrivateRoute';
import MealPlan from './pages/MealPlan';
import TeamMember from "./pages/Team";
import Home from './pages/Home';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import Recipe from './pages/Recipe.jsx';
import Login from "./pages/Login";
import ShoppingList from './pages/ShoppingList';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  render() {
    return (
      <Router>
        <Route exact path="/" component={Home}/>
        <Route exact path="/Team" component={TeamMember}/>
        <Route exact path="/Login" component={Login}/>
        <Route exact path="/Meeting_Notes" component={Meeting_Notes}/>
        <PrivateRoute path='/Recipes' component={Recipe}/>
        <PrivateRoute path='/Inventory' component={Inventory}/>
        <PrivateRoute exact path="/MealPlan" component={MealPlan}/>
        <PrivateRoute exact path="/ShoppingList" component={ShoppingList}/>
        <Route exact path="/Home" component={Home}/>
      </Router>
    );
  }
}

export default withCookies(App);
