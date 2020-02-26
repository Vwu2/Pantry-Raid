import React, {Component} from 'react';
import {Accordion, Button, Card, ListGroup} from 'react-bootstrap';
import Step1Meal from '../components/Step1Meals';
import Step2Meal from '../components/Step2Meals';
import CalendarSelection from '../components/CalendarSelection';
import ReadCalendarView from '../components/ReadCalendarView';
import PantryRaidNavBar from '../components/PantryRaidNavBar';
import {RECIPE_NAMES} from '../globals/recipes';
import "./MealPlan.css";
import {createSessionFormData} from "../globals/sessionform";
import {withCookies} from "react-cookie";
import {Redirect} from "react-router-dom";

class MealPlan extends Component {
  state = {
    selectedDates: null,
    currentStep: 1,
    addedMealNames: [],
    amountOfMealsPerDay: 1,
    errorMessage: '',
    mealPlans: [],
    clickedViewPlan: false,
    clickedCreateMealPlan: false,
    needLogin: false,
  };

  componentDidMount() {
    this.getDataFromDb();
  }

  getDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.response === 'failure') {
          this.setState({needLogin: true})
        } else {
          this.setState({
            mealPlans: JSON.parse(req.response).map(mp => ({
              meals: mp.recipes,
              dates: {start: new Date(mp.start_date * 1000), end: new Date(mp.end_date * 1000)},
              mpid: mp.mpid
            }))
          });
        }
      }
    };

    const formData = createSessionFormData(this.props);
    req.open('POST', 'http://cryptoflipit.com/backend/get_meal_plans');
    req.send(formData);
  };

  handleRemoveMealPlan = (mpid) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.getDataFromDb();
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('mpid', mpid);
    req.open('POST', 'http://cryptoflipit.com/backend/remove_meal_plan');
    req.send(formData);
  };

  handleCalendarSelect = (event) => {
    if (event.eventType === 3) {
      this.setState({
        selectedDates: {
          start: event.start,
          end: event.end,
        }
      });
    }
  };

  handleNextStep = () => {
    let currentStep = this.state.currentStep;

    currentStep = currentStep >= 3 ? 4 : currentStep + 1;

    if (this.state.currentStep === 2) {
      //the array Does not include an undefined object
      if (this.state.addedMealNames.length > 0 && !this.state.addedMealNames.includes(undefined)) {
        this.setState({
          currentStep: currentStep,
          errorMessage: ''
        });
      } else {
        this.setState({
          errorMessage: 'Error: Please add meals'
        });
      }
    } else {
      this.setState({
        currentStep: currentStep
      });
    }
  };

  handlePrevStep = () => {
    let currentStep = this.state.currentStep;

    currentStep = currentStep <= 0 ? 0 : currentStep - 1;

    if (currentStep === 0) {
      this.setState({
        currentStep: 1
      });
      this.setViewDefault();
    } else if (currentStep === 1) {
      this.setState({
        amountOfMealsPerDay: 1,
        currentStep: currentStep,
        addedMealNames: [],
      });
      this.setDefaultErrorMessage();
    } else if (currentStep === 2) {
      this.setState({
        selectedDates: null,
        currentStep: currentStep
      });
      this.setDefaultErrorMessage();
    } else {
      this.setState({
        currentStep: currentStep
      })
    }
  };

  handleAddMeals = (index, mealName) => {
    const addedMealArr = this.state.addedMealNames;

    addedMealArr[index] = mealName.value;

    this.setState({
      addedMealNames: addedMealArr
    });
  };

  handleMealAmount = (mealAmount) => {
    this.setState({
      amountOfMealsPerDay: mealAmount.value
    });
  };

  setDefaultErrorMessage = () => {
    this.setState({errorMessage: ''});
  };

  handleGenerateMealPlan = () => {
    //handle uploading info
    if (this.state.selectedDates !== null) {
      const req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState === 4) {
          this.getDataFromDb();
          this.setState({
            //mealPlans: addedMealPlans,
            clickedViewPlan: false,
            clickedCreateMealPlan: false,
            currentStep: 1,
            selectedDates: null,
            amountOfMealsPerDay: 1,
          });
          this.setDefaultErrorMessage();
        }
      };

      const formData = createSessionFormData(this.props);
      formData.append('recipes', JSON.stringify(this.state.addedMealNames));
      formData.append('start_date', (this.state.selectedDates.start.getTime() / 1000).toString());
      formData.append('end_date', (this.state.selectedDates.end.getTime() / 1000).toString());
      req.open('POST', 'http://cryptoflipit.com/backend/add_meal_plan');
      req.send(formData);
    } else {
      this.setState({
        errorMessage: "Error: Please select Dates"
      });
    }
  };

  handleCreateMealPlanRender = () => {
    this.setState({
      clickedCreateMealPlan: true,
      clickedViewPlan: false
    });
  };

  handleViewMealPlanRender = () => {
    this.setState({
      clickedCreateMealPlan: false,
      clickedViewPlan: true
    });
  };

  setViewDefault = () => {
    this.setState({
      clickedCreateMealPlan: false,
      clickedViewPlan: false,
    });
  };

  dateFormat = (startDate, endDate) => {
    return (startDate.getMonth() + "/" + startDate.getDate() + " - " + endDate.getMonth() + "/" + endDate.getDate());
  };

  render = () => {
    if (this.state.needLogin === true) {
      return (
        <Redirect to={{pathname: '/Login'}}/>
      );
    }

    if (this.state.clickedViewPlan === false && this.state.clickedCreateMealPlan === false) {
      return (
        <div>
          <PantryRaidNavBar/>
          <div className="Landing__Banner">
            <h1 style={{
              margin: 'auto',
              fontSize: '18',
              display: 'block',
              font: 'bold',
              'fontFamily': 'Pacifico,cursive',
              color: '#fff'
            }}>Meal Planning Made Easier</h1>
          </div>
          <div className="Survey mt-3" style={{justifyContent: 'center', textAlign: 'center', top: '30%', left: '30%'}}>
            <Button className="btn-lg mb-3 button" onClick={this.handleViewMealPlanRender}>View Meal Plan</Button>
            <Button className="button btn-lg mt-3" onClick={this.handleCreateMealPlanRender}>Create Meal Plan</Button>
          </div>
        </div>
      );
    } else if (this.state.clickedCreateMealPlan === true && this.state.clickedViewPlan === false) {
      return (
        <div>
          <div>
            <PantryRaidNavBar/>
            <h1 className="Survey-Header mt-4 mb-4">
              {
                this.state.errorMessage === '' ?
                  "some quick questions to generate that awesome meal plan"
                  :
                  this.state.errorMessage
              }
            </h1>
          </div>

          <div className="Survey">
            <Step1Meal
              currentStep={this.state.currentStep}
              handleMealAmount={this.handleMealAmount}
            />
            <Step2Meal
              currentStep={this.state.currentStep}
              amountOfMealsPerDay={this.state.amountOfMealsPerDay}
              handleAddMeals={this.handleAddMeals}
            />
            <CalendarSelection
              currentStep={this.state.currentStep}
              handleCalendarSelect={this.handleCalendarSelect}
            />
          </div>
          <div>

            <Button className="mt-3 ml-4" size="lg" variant="secondary" onClick={this.handlePrevStep}>Prev</Button>
            {
              this.state.currentStep <= 3 && this.state.selectedDates === null ?
                <Button className="float-right mt-3 mr-4" size="lg" onClick={this.handleNextStep}>Next</Button>
                :
                <Button className="float-right mt-3 mr-4" size="lg" onClick={this.handleGenerateMealPlan}>Generate Meal
                  Plan</Button>
            }
          </div>
        </div>
      );
    } else if (this.state.clickedViewPlan === true && this.state.clickedCreateMealPlan === false) {
      return (
        <div>
          <PantryRaidNavBar/>
          <h1>View Meal Plan<Button onClick={this.setViewDefault} className='mt-2 mr-2'
                                    style={{marginLeft: 'auto', float: 'right'}}>Prev</Button></h1>
          <ListGroup as='ul' style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            {
              this.state.mealPlans.map(mealPlan => (
                <Accordion key={`${this.dateFormat(mealPlan.dates.start, mealPlan.dates.end)}`}>
                  <ListGroup.Item>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Card.Header}
                                          eventKey={`${this.dateFormat(mealPlan.dates.start, mealPlan.dates.end)}`}
                                          className=' p-0' style={{
                          marginRight: '2em',
                          marginTop: '0.8em',
                          border: '0',
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          textAlign: 'center',
                          fontSize: 24
                        }}>

                          {`${this.dateFormat(mealPlan.dates.start, mealPlan.dates.end)}`}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={`${this.dateFormat(mealPlan.dates.start, mealPlan.dates.end)}`}
                                          width={'100%'}>
                        <div>
                          <ReadCalendarView selected={mealPlan.dates}/>
                          <ListGroup as='ul'>
                            {
                              mealPlan.meals.map(recipeId => (
                                <ListGroup.Item>
                                  {RECIPE_NAMES.get(recipeId)}
                                </ListGroup.Item>
                              ))
                            }
                            <Button variant="danger"
                                    onClick={() => this.handleRemoveMealPlan(mealPlan.mpid)}>Remove</Button>
                          </ListGroup>
                        </div>

                      </Accordion.Collapse>
                    </Card>
                  </ListGroup.Item>
                </Accordion>
              ))
            }
          </ListGroup>
        </div>
      );
    }
  }
}

export default withCookies(MealPlan)