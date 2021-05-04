import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import { IRoomInfo } from '../Main';
import BookingSummary from './BookingSummary';
import Button from '../../components/DarkButton';
import WhiteButton from '../../components/WhiteButton';
import Table from '../../components/Table';

import postData from '../../lib/post';
import toCurrency from '../../lib/currency';

interface ITimetableProps {
  date: Date
  close: () => void
}

interface IRoomViewInfo extends IRoomInfo {
  booked: number
}

const Timetable: FC<ITimetableProps> = props => {
  const { date, close } = props;
  const [booking, setBooking] = useState<IRoomInfo | null>(null);

  const [data, setData] = useState<Array<IRoomViewInfo> | null>(null);
  useEffect(fetchData, [date]);

  function fetchData() {
    postData('/api/rooms/student', { date })
    .then((rooms: Array<any>) => {
      setData(rooms.map(room => ({ 
        ...room, booked: 0, 
        timefrom: new Date(room.timefrom), 
        timeto: new Date(room.timeto) 
      })));
    })
    .catch();
  }

  return booking ? (
    <BookingSummary paid={false} booking={booking} cancel={() => setBooking(null)} />
  ) : (
    <Body>
      <div>Date Selected: {date.toLocaleDateString()}</div>
      {!data ? <div>loading...</div> : 
      data.length === 0 ? <div>No rooms available.</div> : (
        <Table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Time</th>
              <th>Room Capacity</th>
              <th>Hosted By</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((room, i) => (
              <tr key={i}>
                <td>{room.name}</td>
                <td>{`${room.timefrom.toLocaleTimeString()} - ${room.timeto.toLocaleTimeString()}`}</td>
                <td>{`${room.booked}/${room.capacity}`}</td>
                <td>{room.host}</td>
                <td>{toCurrency(room.price)}</td>
                <td>
                  <WhiteButton onClick={() => setBooking(room)}>Book</WhiteButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Button onClick={close}>Go Back</Button>
    </Body>
  );
}

export default Timetable;

const Body = styled.div`
  > div:first-child {
    font-weight: 600;
    margin-bottom: 5px;
  }

  > button {
    display: block;
    margin: 20px auto;
    font-size: 16px;
  }

  > table {
    td:last-child {
      width: 1%;
      padding: 0 20px;
    }

    button {
      width: 80px;
    }
  }
`;