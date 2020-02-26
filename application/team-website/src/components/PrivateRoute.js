import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {withCookies} from "react-cookie";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);

    const {component, authed, ...rest} = props;
    this.state = {
      rest: rest,
      component: component
    }
  }

  render() {
    const {cookies} = this.props;
    return (
      <Route
        {...this.state.rest}
        render={(props) => {
          return cookies.get('session') !== undefined
            ? <this.props.component {...props}/>
            : <Redirect to={{pathname: '/Login'}}/>
        }}
      />
    )
  }
}

export default withCookies(PrivateRoute);
