import React, {Component} from 'react';
import Select from 'react-select';
import {RECIPE_OPTIONS} from '../globals/recipes'


class Step2Meals extends Component {

  createMultipleSelections = () => {
    let multSelections = [];

    for (let index = 0; index < this.props.amountOfMealsPerDay; index++) {
      multSelections.push(
        <Select
          className="mb-3 mr-4 ml-4"
          placeholder="Select a recipe..."
          options={RECIPE_OPTIONS}
          onChange={(mealOptions) => this.props.handleAddMeals(index, mealOptions)}
        />
      );
    }
    return multSelections;
  };

  render() {

    if (this.props.currentStep !== 2) {
      return null;
    }

    return (
      <div>
        <h1 className="mt-5 mr-4 ml-4 " style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Quicksand,sans-serif',
          fontWeight: 'bold',
          fontSize: '1.5em'
        }}>
          Add Your Meals
        </h1>
        {this.createMultipleSelections()}
      </div>
    );
  }
}

export default Step2Meals;