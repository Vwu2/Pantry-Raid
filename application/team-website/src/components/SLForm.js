import React, {Component} from 'react';
import {Button, Form} from 'react-bootstrap';
import ListItems from './ListItems';
// import {FOOD_NAMES, FOOD_OPTIONS} from '../globals/foods';
import {FOOD_OPTIONS} from '../globals/foods'
import Select from 'react-select';
import {createSessionFormData} from "../globals/sessionform";
import {withCookies} from "react-cookie";


class SLForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: '',
      //rename items to ingredientNames
      items: [],
      currentItem: {
        text: '',
        id: -1,
        key: ''
      }
    };
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this)
  }

  handleInput = (food) => {
    this.setState({
      currentItem: {
        text: food.label,
        id: food.value,
        key: Date.now()
      }
    })
    // console.log(e.currentTarget)
  };

  addItem(e) {
    e.preventDefault();
    const newItem = this.state.currentItem;
    if (newItem.text !== "") {
      // Destructing Assignment
      const newItems = [...this.state.items, newItem]; // this unpacks the list and converst in to indiciaul items, similiar to split in java
      this.setState({
        items: newItems,
        currentItem: {
          text: '',
          key: ''
        }
      })
    }
    // console.log(newItem)
    console.log(this.state)
  }

  //backend upload items
  //work with items and listName
  handleUploadItems = () => {
    console.log('saving stuff');
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        this.props.handleAddComplete();
      }
    };

    const formData = createSessionFormData(this.props);
    formData.append('name', this.state.listName);
    formData.append('foods', JSON.stringify(this.state.items.map(x => x.id)));

    req.open('POST', 'http://cryptoflipit.com/backend/add_shopping_list');
    req.send(formData);
  };

  deleteItem(key) {
    const filteredItems = this.state.items.filter(item =>
      item.key !== key);
    this.setState({
      items: filteredItems
    });
    console.log(this.state.items)
  }

  setUpdate(text, key) {
    const items = this.state.items;
    items.map(item => {
      if (item.key === key) {
        item.text = text
      }
    });
    this.setState({
      items: items
    })
  }

  handleNameInput(e) {
    this.setState({
      listName: e.target.value
    })
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Group controlId="SLForm.ControlInput1">
            <Form.Label><strong>New Shopping List Name:</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Shopping List Name"
              defaultValue={this.state.listName}
              onChange={this.handleNameInput}
            />
            <hr/>
            <Form.Label><strong>Add Item</strong></Form.Label>

            {/* <Form.Control
                            type="text" 
                            placeholder="Enter Item to Add" 
                            defaultValue={this.state.currentItem.text} 
                            onChange={this.handleInput}
                        /> */}
            <Select
              options={FOOD_OPTIONS}
              onChange={(food) => this.handleInput(food)}
            />

            <Button onClick={this.addItem} variant="success">Add Item +</Button>
          </Form.Group>

          <ListItems
            items={this.state.items}
            deleteItem={this.deleteItem}
            setUpdate={this.setUpdate}
          ></ListItems>
          <hr/>
          <Button onClick={this.handleUploadItems} style={{float: "right"}}>Save</Button>
        </Form>
      </div>
    );
  }
}

export default withCookies(SLForm);
