import { FC, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface ITimePickerProps {
  value: Date
  onChange: (date: Date) => void
}

const TimePicker: FC<ITimePickerProps> = props => {
  const { value, onChange } = props;

  const hoursRef = useRef<Array<number>>();
  const minutesRef = useRef<Array<number>>();

  const initialize = useCallback(() => {
    const hours = [], minutes = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    hoursRef.current = hours;
    minutesRef.current = minutes;
  }, []);

  function handleChange(hour?: number, minute?: number) {
    const newDate = new Date(value.getTime());
    if (hour) {
      newDate.setHours(hour);
    }
    if (minute) {
      newDate.setMinutes(minute);
    }
    onChange(newDate);
  }

  if (!hoursRef.current || !minutesRef.current) initialize();
  return (
    <TimePickerStyles>
      <select value={value.getHours()}
        onChange={e => handleChange(parseInt(e.target.value))}>
        {hoursRef.current?.map(hour => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>
      <select value={value.getMinutes()}
        onChange={e => handleChange(undefined, parseInt(e.target.value))}>
        {minutesRef.current?.map(minute => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </select>
    </TimePickerStyles>
  );
}

export default TimePicker;

const TimePickerStyles = styled.div`
  display: inline-flex;
  width: 450px;
  margin-left: 20px;
  justify-content: space-between;

  > select {
    width: 49%;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 7px;

    &:focus {
      outline: none;
      border-color: #66aee9;
      box-shadow: 0 0 5px#66aee9;
    }
  }
`;