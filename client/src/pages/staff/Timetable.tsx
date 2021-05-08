import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import Table from '../../components/Table';
import Button from '../../components/DarkButton';
import FormStyles from '../../components/Form';
import TimePicker from '../../components/TimePicker';
import { IRoomInfo } from '../Main';

import useSession from '../../lib/useSession';
import postData from '../../lib/post';
import toCurrency from '../../lib/currency';

interface ITimetableProps {
  date: Date
  close: () => void
}

interface IFormProps {
  date: Date
  onFinish: () => void
}

interface IRoomViewInfo extends IRoomInfo {
  bookcount: number
}

const Form: FC<IFormProps> = props => {
  const { date, onFinish } = props;
  const { session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const [roomName, setRoomName] = useState<string>('');
  const [timeFrom, setTimeFrom] = useState<Date>(date);
  const [timeTo, setTimeTo] = useState<Date>(date);
  const [roomCapacity, setRoomCapacity] = useState<string>('');
  const [roomPrice, setRoomPrice] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');

  function handleSubmit (launch: boolean) {
    const noBlank = [roomName, roomCapacity, roomPrice].every(f => f && f.length > 0);
    const timeSet = (timeFrom !== undefined) && (timeTo !== undefined);
    if (noBlank && timeSet) {
      setError(null);
      const formData: IRoomViewInfo = {
        name: roomName!,
        timefrom: timeFrom!,
        timeto: timeTo!,
        bookcount: 0,
        capacity: parseInt(roomCapacity!),
        host: session!.username,
        price: parseFloat(roomPrice!),
        active: launch,
        promocode: promoCode || null
      };
      postData('/api/rooms/create', formData)
      .then(response => {
        if (response.added) {
          onFinish();
        }
        else {
          setError("Room name is already taken.");
        }
      })
      .catch(() => setError("A problem occured."));
    }
    else {
      setError("All fields must not be blank.");
    }
  }

  return (
    <FormStyles>
      {error && <div>{error}</div>}
      <label>Room Name:<input type='text' value={roomName} onChange={e => setRoomName(e.target.value)} /></label>
      <label>Open From:<TimePicker value={timeFrom} onChange={dt => setTimeFrom(dt)} /></label>
      <label>Open Until:<TimePicker value={timeTo} onChange={dt => setTimeTo(dt)} /></label>
      <label>Capacity:<input type='number' value={roomCapacity} onChange={e => setRoomCapacity(e.target.value)} /></label>
      <label>Price:<input type='number' value={roomPrice} onChange={e => setRoomPrice(e.target.value)} /></label>
      <label>Promo Code (Optional):<input type='text' value={promoCode} onChange={e => setPromoCode(e.target.value)} /></label>
      <div>
        <button onClick={() => handleSubmit(false)}>Create Room</button>
        <button onClick={() => handleSubmit(true)}>Create Room and Launch</button>
      </div>
    </FormStyles>
  );
}

const Timetable: FC<ITimetableProps> = props => {
  const { date, close } = props;
  const [adding, setAdding] = useState<boolean>(false);

  const [data, setData] = useState<Array<IRoomViewInfo> | null>(null);
  useEffect(fetchData, [date]);

  function fetchData() {
    postData('/api/rooms', { date })
    .then((rooms: Array<IRoomViewInfo>) => {
      setData(rooms.map(room => ({ 
        ...room, 
        timefrom: new Date(room.timefrom), 
        timeto: new Date(room.timeto) 
      })));
    });
  }

  return (
    <Body>
      <div>Date Selected: {date.toLocaleDateString()}</div>
      {adding ? (
        <Form date={date} onFinish={() => {
          setAdding(false);
          fetchData();
        }} />
      ) : (
        <Button onClick={() => setAdding(true)}>Create New Room</Button>
      )}
      {!data ? <div>loading...</div> : 
      data.length === 0 ? <div>No rooms available.</div> : (
        <Table>
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
            {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((room, i) => (
              <tr key={i}>
                <td>{room.name}</td>
                <td>{`${room.timefrom.toLocaleTimeString()} - ${room.timeto.toLocaleTimeString()}`}</td>
                <td>{`${room.bookcount}/${room.capacity}`}</td>
                <td>{room.host}</td>
                <td>{toCurrency(room.price)}</td>
                <td>{room.promocode}</td>
                <td>{room.active ? 'Active' : 'Inactive'}</td>
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
  }

  > button {
    display: block;
    margin: 20px auto;
    font-size: 16px;
  }
`;
