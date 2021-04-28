import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import useSession from '../lib/useSession';
import toCurrency from '../lib/currency';

interface ITimetableProps {
  date: Date
}

interface ITimePickerProps {
  onChange: (hour?: number, minute?: number) => void
}

interface IRoomInfo {
  name: string
  timeFrom: Date
  timeTo: Date
  booked: number
  capacity: number
  host: string
  price: number
  active: boolean
  promocode: string | null
}

const TimePicker: FC<ITimePickerProps> = props => {
  const { onChange } = props;

  const [hours, setHours] = useState<Array<number> | null>(null);
  const [minutes, setMinutes] = useState<Array<number> | null>(null);
  useEffect(initialize, []);

  function initialize() {
    const hours = [], minutes = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    setHours(hours);
    setMinutes(minutes);
  }

  return (
    <TimePickerStyles>
      <select onChange={e => onChange(parseInt(e.target.value), undefined)}>
        {hours?.map(hour => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>
      <select onChange={e => onChange(undefined, parseInt(e.target.value))}>
        {minutes?.map(minute => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </select>
    </TimePickerStyles>
  );
}

const Timetable: FC<ITimetableProps> = props => {
  const { date } = props;
  const { session } = useSession();

  const [data, setData] = useState<Array<IRoomInfo> | null>(null);
  useEffect(fetchData, []);

  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);

  const [roomName, setRoomName] = useState<string>();
  const [timeFrom, setTimeFrom] = useState<Date>();
  const [timeTo, setTimeTo] = useState<Date>();
  const [roomCapacity, setRoomCapacity] = useState<string>();
  const [roomPrice, setRoomPrice] = useState<string>();
  const [promoCode, setPromoCode] = useState<string>();

  function fetchData() {
    // TODO: fetch here
    // setData();
  }

  function handleSubmit (launch: boolean) {
    const noBlank = [roomName, timeFrom, timeTo, roomCapacity, roomPrice].every(f => f !== undefined);
    if (noBlank) {
      setError(null);
      const formData: IRoomInfo = {
        name: roomName!,
        timeFrom: timeFrom!,
        timeTo: timeTo!,
        booked: 0,
        capacity: parseInt(roomCapacity!),
        host: session!.username,
        price: parseFloat(roomPrice!),
        active: launch,
        promocode: promoCode || null
      };
      // TODO: submit here
      console.log(formData);
    }
    else {
      setError("All fields must not be blank.");
    }
  }

  function dateFromChange (prevState?: Date, hour?: number, minute?: number) {
    const newDate = new Date(prevState?.getTime() || date.getTime());
    if (hour) {
      newDate.setHours(hour);
    }
    if (minute) {
      newDate.setMinutes(minute);
    }
    return newDate;
  }

  const Form = (
    <FormStyles>
      {error && <div>{error}</div>}
      <label>Room Name:<input type='text' value={roomName} onChange={e => setRoomName(e.target.value)} /></label>
      <label>Open From:<TimePicker onChange={(h, m) => setTimeFrom(dateFromChange(timeFrom, h, m))} /></label>
      <label>Open Until:<TimePicker onChange={(h, m) => setTimeTo(dateFromChange(timeTo, h, m))} /></label>
      <label>Capacity:<input type='number' value={roomCapacity} onChange={e => setRoomCapacity(e.target.value)} /></label>
      <label>Price:<input type='number' value={roomPrice} onChange={e => setRoomPrice(e.target.value)} /></label>
      <label>Promo Code (Optional):<input type='text' value={promoCode} onChange={e => setPromoCode(e.target.value)} /></label>
      <div>
        <button onClick={() => handleSubmit(false)}>Create Room</button>
        <button onClick={() => handleSubmit(true)}>Create Room and Launch</button>
      </div>
    </FormStyles>
  );

  return (
    <Body>
      <div>Date Selected: {date.toLocaleDateString()}</div>
      {adding ? Form : (
        <button onClick={() => setAdding(true)}>Create New Room</button>
      )}
      {!data ? (
        <div>loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Time</th>
              <th>Room Capacity</th>
              <th>Created By</th>
              <th>Price</th>
              <th>Promo Code</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {data.map((room, i) => (
              <tr key={i}>
                <td>{room.name}</td>
                <td>{`${room.timeFrom.toLocaleTimeString()}-${room.timeTo.toLocaleTimeString()}`}</td>
                <td>{`${room.booked}/${room.capacity}`}</td>
                <td>{room.host}</td>
                <td>{toCurrency(room.price)}</td>
                <td>{room.promocode}</td>
                <td>{room.active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Body>
  );
}

export default Timetable;

const Body = styled.div`
  > div:first-child {
    font-weight: 600;
  }

  > button:first-of-type {
    background-color: #324045;
    color: #fff;
    border: none;
    border-radius: 2px;
    margin: 20px auto;
    padding: 10px 20px;
    display: block;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;

    &:hover {
      cursor: pointer;
      background-color: #222323;
    }
  }

  > table {
    border-collapse: collapse;
    width: 100%;

    th, td {
      border: 1px solid #ccc;
      text-align: center;

      &:first-child {
        text-align: left;
        padding-left: 10px;
      }
    }

    th {
      background-color: #01668c;
      color: #fff;
      padding: 10px 0;
    }

    td {
      padding: 15px 0;
    }
  }
`;

const FormStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;

  > div:first-child {
    background-color: #f2dedd;
    color: #aa4442;
    border: 1px solid #ebccd1;
    border-radius: 2px;
    margin-bottom: 16px;
    padding: 10px 0;
    width: 650px;
    font-size: 14px;
    text-align: center;
  }

  > label {
    width: 650px;
    text-align: right;
    font-weight: 600;
    margin-bottom: 12px;

    > input[type='text'],
    > input[type='number'] {
      width: 450px;
      border: 1px solid #ccc;
      border-radius: 2px;
      margin-left: 20px;
      padding: 8px;

      &:focus {
        outline: none;
        border-color: #66aee9;
        box-shadow: 0 0 5px#66aee9;
      }
    }
  }

  > div:last-child {
    > button {
      background-color: #509e04;
      color: #fff;
      border: none;
      border-radius: 2px;
      width: 180px;
      padding: 12px 0;
      margin: 0 6px;
      font-weight: 600;
      text-transform: uppercase;

      &:hover {
        cursor: pointer;
        background-color: darkgreen;
      }
    }
  }
`;

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
