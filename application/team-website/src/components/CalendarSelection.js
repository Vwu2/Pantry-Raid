import React, {Component} from 'react';
import InfiniteCalendar, {Calendar, withRange} from 'react-infinite-calendar';

class CalendarTime extends Component {

  render() {
    const today = new Date();
    const max = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (this.props.currentStep !== 3) {
      return null;
    }

    return (
      <InfiniteCalendar
        Component={withRange(Calendar)}
        selected={null}
        min={today}
        max={max}
        height={'100%'}
        width={'100%'}
        onSelect={this.props.handleCalendarSelect}
        locale={{
          headerFormat: 'MMM Do'
        }}
      />
    );
  }
}

export default CalendarTime;