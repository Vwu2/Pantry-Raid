import React from 'react';
import {Cell, Grid} from 'react-mdl';


const Person = (props) => {
  return (
    <div className="container">
      <Grid>
        <Cell col={12}>
          <img
            src={props.image}
            alt="avatar"
            className="avatar-img"
          />
          <div className="banner-text">
            <h1>{props.name}</h1>
            <h3>{props.role}</h3>
            <hr/>
            <p>{props.biography}</p>
          </div>
        </Cell>
      </Grid>
    </div>
  );
};

export default Person;
