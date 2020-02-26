import React, {Component} from 'react';
import PantryRaidBlock from '../components/PantryRaidBlock';
import PantryRaidNavBar from '../components/PantryRaidNavBar';
import {Button, ButtonGroup} from 'react-bootstrap';

class UserHome extends Component {
  render() {
    return (
      <div>
        <PantryRaidNavBar/>
        <PantryRaidBlock/>

        <ButtonGroup vertical className="btn-lg btn-block text-center mt-3">
          <Button className="mb-3">Inventory</Button>
          <Button className="mb-3">Recipe</Button>
          <Button className="mb-3">Shopping List</Button>
          <Button className="mb-3">Meal Plan</Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default UserHome;
