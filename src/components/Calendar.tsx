import { Component } from 'react';
import styled from 'styled-components';

interface ICalendarState {
  // here
}

class Calendar extends Component<never, ICalendarState> {
  constructor(props: never) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <CalendarStyles>
        <div>Calendar here.</div>
      </CalendarStyles>
    );
  }
}

export default Calendar;

const CalendarStyles = styled.div`
  // here
`;