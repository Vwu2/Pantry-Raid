import React, {Component} from 'react';
import {Accordion, Button, Card, FormControl, InputGroup, ListGroup, Modal} from 'react-bootstrap';

import PantryRaidNavBar from '../components/PantryRaidNavBar';
import {createSessionFormData} from '../globals/sessionform';
import {withCookies} from 'react-cookie';
import {FOOD_NAMES} from '../globals/foods';
import {RECIPE_IMAGES} from '../globals/images';
import {Redirect} from "react-router-dom";

const images = require.context('../images/recipe_images', true);

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      recipeInput: '',
      recipeNotFound: false,
      ingredientsToBeAdded: [],
      recipeToBeAdded: '',
      errorMessage: '',
      show: false,
      inventory: new Set(),
      needLogin: false,
    };
    this.handleChange = this.handleChange.bind(this);
  };

  componentDidMount() {
    this.getInventoryDataFromDb();
    this.getRecommendationDataFromDb();
  }

  handleChange = event => {
    const value = event.target.value;
    this.setState({recipeInput: value})
  };

  handleSearchRecipe = event => {
    event.preventDefault();
    if (this.state.recipeInput === '') {
      this.getRecommendationDataFromDb();
    } else {
      this.setState({errorMessage: ''});
      this.getSearchDataFromDb();
    }
  };

  handleAddToShoppingList = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.getInventoryDataFromDb();
        this.setState({show: false})
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('name', this.state.recipeToBeAdded);
    formData.append('foods', JSON.stringify(this.state.ingredientsToBeAdded));

    req.open('POST', 'http://cryptoflipit.com/backend/add_shopping_list');
    req.send(formData);
  };

  handleAddIngredientsToArr = (recipeIngredients) => {
    this.setState({
      show: true,
      ingredientsToBeAdded: recipeIngredients
    })
  };

  handleShowModal = (ingredients) => {
    this.setState(prevState => ({
      show: !prevState.show,
      ingredientsToBeAdded: [],
    }));
  };

  handleQueryResponse = (response) => {
    if (response === '') {
      this.setState({errorMessage: 'No recipe found'});
    } else {
      this.setState({errorMessage: ''});
      const recipes = JSON.parse(response);
      for (const recipe of recipes) {
        recipe.image = images(`./${RECIPE_IMAGES.get(recipe.id)}`);
      }
      this.setState({recipes: recipes})
    }
  };

  getRecommendationDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.handleQueryResponse(req.response)
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('start', '0');
    formData.append('stop', '8');

    req.open('POST', 'http://cryptoflipit.com/backend/recommend_recipes');
    req.send(formData);
  };

  //call getDataFromDb if input not empty
  getSearchDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.handleQueryResponse(req.response)
      }
    };

    // const formData = createSessionFormData(this.props);
    const formData = createSessionFormData(this.props);
    formData.append('query', this.state.recipeInput);

    req.open('POST', 'http://cryptoflipit.com/backend/search_recipes');
    req.send(formData);
  };

  getInventoryDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.response === 'failure') {
          this.setState({needLogin: true})
        } else {
          this.state.inventory.clear();
          for (const food of JSON.parse(req.response)) {
            this.state.inventory.add(food[0])
          }
        }
      }
    };

    const formData = createSessionFormData(this.props);
    req.open('POST', 'http://cryptoflipit.com/backend/inventory');
    req.send(formData);
  };

  render() {
    if (this.state.needLogin === true) {
      return (
        <Redirect to={{pathname: '/Login'}}/>
      );
    }

    return (
      <div>
        <PantryRaidNavBar/>
        <h1 style={{textAlign: 'center'}}>Recipes</h1>
        <InputGroup>
          <FormControl onChange={this.handleChange}/>
          <InputGroup.Append>
            <Button varient='primary' onClick={this.handleSearchRecipe}> Search </Button>
          </InputGroup.Append>
        </InputGroup>

        <pre><h4 className='text-center'>{this.state.errorMessage}</h4></pre>

        <ListGroup as='ul' style={{display: 'flex', justifyContent: 'left', textAlign: 'left'}}>
          {this.state.recipes.map(recipe => (
            <Accordion>
              <ListGroup.Item as='li' className='p-0 mb-0' key={recipe.id}>
                <Card className='mb-0'>
                  <Accordion.Toggle as={Card.Header} eventKey={recipe.id} className=' p-0' style={{
                    backgroundColor: '#f7f7f7',
                  }}>
                    <Card.Header className='p-0 mb-0'>
                      <img width='30%'
                           src={recipe.image}
                           className='rounded float-left' alt=''/>
                    </Card.Header>
                    <div style={{
                      display: 'flex',
                      flexFlow: 'column',
                      height: '100%',
                      marginTop: '0.8em',
                      border: '0',
                      textAlign: 'center',
                      fontSize: 24
                    }}>
                      {recipe.name}
                    </div>
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey={recipe.id}>
                    <Card.Body>
                      <Card.Text style={{display: 'flex', fontSize: 18, justifyContent: 'center', textAlign: 'center'}}>
                        Ingredients
                      </Card.Text>
                      {recipe.foods.map(food => (
                        <li key={`${recipe.id}-${food}`}>{
                          this.state.inventory.has(food)
                            ? (<b>{FOOD_NAMES.get(food)}</b>)
                            : FOOD_NAMES.get(food)
                        }</li>
                      ))}
                      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        <Button variant='primary' size='sm'
                                onClick={() => this.setState({
                                  show: true,
                                  ingredientsToBeAdded: recipe.foods,
                                  recipeToBeAdded: recipe.name
                                })}
                                style={{marginTop: '1em'}}>Add Ingredients to Shopping List
                        </Button>
                      </div>
                      <Card.Text style={{display: 'flex', fontSize: 18, justifyContent: 'center', textAlign: 'center'}}>
                        Directions
                      </Card.Text>
                      <div dangerouslySetInnerHTML={{__html: recipe.directions}}/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </ListGroup.Item>
            </Accordion>
          ))}
        </ListGroup>

        <Modal show={this.state.show} onHide={this.handleShowModal}
               style={{position: 'fixed', top: '25%', left: '10%%'}}>
          <Modal.Header closeButton>
            <Modal.Title>Add these ingredients?</Modal.Title>
          </Modal.Header>
          <ListGroup as='ul' style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            {
              this.state.ingredientsToBeAdded.map(ingredient => (
                <ListGroup.Item as='li'>
                  {FOOD_NAMES.get(ingredient)}
                </ListGroup.Item>
              ))
            }
          </ListGroup>
          <Modal.Footer>
            <Button
              varient='outline-secondary'
              onClick={this.handleAddToShoppingList}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default withCookies(Recipe);
