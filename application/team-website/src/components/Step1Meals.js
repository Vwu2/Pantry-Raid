import React, {Component} from 'react';
import Select from 'react-select';

const MEAL_AMOUNT_OPTIONS = [
  {value: 1, label: "One"},
  {value: 2, label: "Two"},
  {value: 3, label: "Three"},
  {value: 5, label: "Five"},
];

class Step1Meal extends Component {

  render() {

    if (this.props.currentStep !== 1) {
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
          How many meals do you (or want to have) in a day?
        </h1>
        <Select className="mt-5 mr-4 ml-4"
                placeholder="Select Amount of Meals"
                options={MEAL_AMOUNT_OPTIONS}
                onChange={(mealAmount) => this.props.handleMealAmount(mealAmount)}
                defaultValue={{value: 1, label: "One"}}
        />
      </div>
    );

  }


}

export default Step1Meal;
