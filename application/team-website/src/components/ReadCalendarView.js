import React, {Component} from 'react';
import InfiniteCalendar, {Calendar, withRange} from 'react-infinite-calendar';
import './ReadCalendarView.css'

class ReadCalendarView extends Component {

  render() {
    const today = new Date();
    const max = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return (

      <InfiniteCalendar className='disableHandle'
                        Component={withRange(Calendar)}
                        selected={this.props.selected}
                        min={today}
                        max={max}
                        height={'100%'}
                        width={'100%'}
                        locale={{
                          headerFormat: 'MMM Do',
                        }}
      />
    );
  }
}

export default ReadCalendarView;