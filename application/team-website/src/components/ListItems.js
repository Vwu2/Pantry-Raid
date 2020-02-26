import React from 'react';
import {Button, Card} from 'react-bootstrap'


function ListItems(props) {
  const editStyle = {
    backgroundColor: 'transparent',
    border: '0',
    outline: 'none'
  };

  const items = props.items;
  const listItems = items.map(item => {
    return (
      <div className="list" key={item.key}>
        {/* <Card body>{item.text}</Card> */}
        <Card>
          <Card.Body>
            <Card.Text>
              <input type="text"
                     id={item.key}
                     value={item.text}
                     style={editStyle}
                     onChange={
                       (e) => {
                         props.setUpdate(e.target.value, item.key)
                       }
                     }
              />
              <Button
                style={{float: 'right'}}
                variant="danger"
                onClick={() => props.deleteItem(item.key)}
              >-</Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  });

  return (
    <div>
      {listItems}
    </div>
  )
}

export default ListItems;
