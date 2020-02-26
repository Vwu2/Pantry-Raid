import React, { Component } from 'react';
import { Accordion, Button, ButtonToolbar, Card, FormControl, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import PantryRaidNavBar from '../components/PantryRaidNavBar';
import { withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import { FOOD_NAMES, FOOD_OPTIONS } from '../globals/foods'
import { createSessionFormData } from '../globals/sessionform'

class Inventory extends Component {
  state = {
    foodItems: [],
    filterItem: '',
    foodToAdd: -1,
    intervalIsSet: false,
    needLogin: false,
    show: false,
    showReceipt: false,
    foodUploadedMessage: '',
    foodUploadError: false,
    foodUploadErrorMessage: '',
    groceryList: '',
    gotResponse: false,
    files: {}
  };

  componentDidMount() {
    this.getDataFromDb();
  }

  handleShowReceiptModal = () => {
    this.setState(prevState => ({
      showReceipt: !prevState.showReceipt,
      groceryList: '',
      gotResponse: false,
    }));
  };

  handleShowModal = () => {
    this.setState(prevState => ({
      show: !prevState.show,
      foodUploadError: false,
      foodUploadErrorMessage: '',
      foodUploadedMessage: '',
    }));
  };

  handleFoodAdd = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.getDataFromDb();
        this.setState({
          foodUploadError: false,
          foodUploadErrorMessage: '',
          foodUploadedMessage: 'Added',
        });
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('food', this.state.foodToAdd.toString());

    req.open('POST', 'http://cryptoflipit.com/backend/add_food');
    req.send(formData);
  };

  removeFoodItem = (id) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.getDataFromDb();
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('food', id.toString());

    req.open('POST', 'http://cryptoflipit.com/backend/remove_food');
    req.send(formData);
  };

  uploadReceipt = () => {
    //handle upload
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.setState({
          groceryList: JSON.parse(req.response),
          gotResponse: true
        });
        this.getDataFromDb();
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('file', this.state.files, this.state.files.name);

    req.open('POST', 'http://cryptoflipit.com/backend/receipt');
    req.send(formData);
  };


  addFile = (event) => {
    const file = event.target.files[0];
    this.setState(prevState => ({
      files: file
    }));
  };

  //handle data retrieval
  getDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        // console.log(`inventory response: ${req.response}`);
        if (req.response === 'failure') {
          this.setState({ needLogin: true })
        } else {
          this.setState({
            foodItems: req.response.length === 0
              ? []
              : JSON.parse(req.response).map(food => {
                return {
                  id: food[0],
                  entries: food[1].map(entry => {
                    return { quantity: entry[0], expiration: new Date(entry[1] * 1000) }
                  })
                }
              })
          });
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
        <Redirect to={{ pathname: '/Login' }} />
      );
    }

    return (
      <div>
        <PantryRaidNavBar />
        <div style={{ display: 'flex' }}>
          <h1 className='ml-2'>Inventory</h1>
          <ButtonToolbar className='mt-2 mr-2' style={{ marginLeft: 'auto', float: 'right' }}>
            <Button className='mr-2' onClick={this.handleShowReceiptModal}>Reciept</Button>
            <Button size='lg' onClick={this.handleShowModal}>+ Add</Button>
          </ButtonToolbar>
        </div>

        <Modal show={this.state.show} onHide={this.handleShowModal}
          style={{ position: 'fixed', top: '25%', left: '10%%' }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Food</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                this.state.foodUploadError ? this.state.foodUploadErrorMessage : this.state.foodUploadedMessage
              }
              <Select
                options={FOOD_OPTIONS}
                onChange={(food) => this.setState({ foodToAdd: food.value })} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button varient='outline-secondary' onClick={this.handleFoodAdd}>Add</Button>
            <Button variant='primary' onClick={this.handleShowModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showReceipt} onHide={this.handleShowReceiptModal}
          style={{ position: 'fixed', top: '25%', left: '10%%' }}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                this.state.gotResponse ? 
                <div>
                  <ListGroup as="li">
                    {
                      this.state.groceryList.map(ingredientId => (
                      <ListGroup.Item>{FOOD_NAMES.get(ingredientId)}</ListGroup.Item>
                      ))
                    }
                  </ListGroup>
                </div> :
                <InputGroup className='mb-3 '>
                <FormControl
                  readOnly
                  type='file'
                  placeholder='Choose a File'
                  onChange={this.addFile}
                />
                <InputGroup.Append>
                  <InputGroup.Text as={Button} onClick={this.uploadReceipt}>Upload</InputGroup.Text>
                </InputGroup.Append>
                {this.state.groceryList}
              </InputGroup>
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {
              this.state.gotResponse ?
                <div>
                  <Button variant='primary' onClick={this.handleShowReceiptModal}>Close</Button>
                </div>
                :
                <Button variant='primary' onClick={this.handleShowReceiptModal}>Close</Button>
            }
          </Modal.Footer>
        </Modal>


        <InputGroup>
          <FormControl
            placeholder='Filter'
            aria-label='Filter'
            aria-describedby='basic-addon2'
            onChange={event => this.setState({ filterItem: event.target.value.toLowerCase() })}
          />
        </InputGroup>

        <ListGroup as='ul' style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          {this.state.foodItems.length <= 0
            ? <div style={{ display: 'flex', justifyContent: 'center' }}> Inventory Empty </div>
            : this.state.foodItems
              .filter(food => FOOD_NAMES.get(food.id).toLowerCase().indexOf(this.state.filterItem) !== -1)
              .map(food => (
                //list the food's name here add key pair
                <Accordion key={food.id}>
                  <ListGroup.Item as='li' className='p-0 mb-0'>
                    <Card className='mb-0'>
                      <Card.Header className='p-0 mb-0'>
                        <Accordion.Toggle as={Button} eventKey={food.id} className='btn-block mb-0'>
                          {FOOD_NAMES.get(food.id)}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={food.id}>
                        <Card.Body>
                          {food.entries.map(entry => (
                            <div key={entry.expiration}>Quantity: {entry.quantity},
                              Expiration: {entry.expiration.toDateString()}</div>
                          ))}
                          <div>Total: {food.entries.reduce((a, b) => a + b.quantity, 0)}</div>
                          <Button variant='danger' onClick={() => this.removeFoodItem(food.id)}>Remove</Button>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </ListGroup.Item>
                </Accordion>
              ))}
        </ListGroup>
      </div>
    );
  }
}

export default withCookies(Inventory);
