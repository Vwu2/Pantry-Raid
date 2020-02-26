import React, {Component} from 'react'
import {Accordion, Button, ButtonToolbar, Card, Modal, Popover} from 'react-bootstrap'
import PantryRaidNavBar from '../components/PantryRaidNavBar';
import SLForm from '../components/SLForm';
import {FOOD_NAMES} from "../globals/foods";
import {createSessionFormData} from "../globals/sessionform";
import {withCookies} from "react-cookie";
import {Redirect} from "react-router-dom";


class ShoppingList extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.state = {
      show: false,
      shoppingLists: [],
      needLogin: false,
    }
  }

  componentDidMount() {
    this.getDataFromDb();
  }

  handleCloseModal() {
    this.setState({show: false})
  }

  handleShowModal() {
    this.setState({show: true})
  }

  handleAddComplete = () => {
    this.handleCloseModal();
    this.getDataFromDb();
  };

  handleRemoveShoppingList = (sid) => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.getDataFromDb();
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('sid', sid);
    req.open('POST', 'http://cryptoflipit.com/backend/remove_shopping_list');
    req.send(formData);
  };

  getDataFromDb = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.response === 'failure') {
          this.setState({needLogin: true})
        } else {
          if (req.response === 'failure') {
            this.setState({needLogin: true})
          } else {
            this.setState({shoppingLists: JSON.parse(req.response)})
          }
        }
      }
    };

    const formData = createSessionFormData(this.props);
    req.open('POST', 'http://cryptoflipit.com/backend/get_shopping_lists');
    req.send(formData);
  };

  render() {
    if (this.state.needLogin === true) {
      return (
        <Redirect to={{pathname: '/Login'}}/>
      );
    }

    const popover = (
      <Popover id="modal-popover" title="popover">

      </Popover>
    );
    return (
      <div>
        <PantryRaidNavBar/>
        <div style={{display: 'flex'}}>
          <h1 className='ml-2'>Shopping Lists</h1>
          <ButtonToolbar className='mt-2 mr-2' style={{marginLeft: 'auto', float: 'right'}}>
            <Button size='lg' onClick={this.handleShowModal}>+ Add</Button>
          </ButtonToolbar>
        </div>
        <div>
          {this.state.shoppingLists.map((listDetail, index) => {
            return (
              <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    {listDetail.name}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {listDetail.foods.map(food => (
                        <div>{FOOD_NAMES.get(food)}</div>
                      ))}
                      {/*<Button>Edit</Button>*/}
                      <Button variant="danger"
                              onClick={() => this.handleRemoveShoppingList(listDetail.sid)}>Delete</Button>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            )
          })}
        </div>
        <Modal show={this.state.show} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Shopping List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SLForm handleAddComplete={this.handleAddComplete}/>
          </Modal.Body>
          {/* <Modal.Footer>
                        <Button onClick={this.handleCloseModal}>Save</Button>
                    </Modal.Footer> */}
        </Modal>
      </div>
    )
  }
}

export default withCookies(ShoppingList)
