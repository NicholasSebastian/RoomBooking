import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { IRoomInfo } from '../Main';
import Table from '../../components/Table';
import FormStyles from '../../components/Form';
import TimePicker from '../../components/TimePicker';
import Button from '../../components/WhiteButton';

import postData, { getData } from '../../lib/post';
import useSession from '../../lib/useSession';
import toCurrency from '../../lib/currency';

interface IFormProps {
  room: IRoomInfo
  onFinish: () => void
}

const Form: FC<IFormProps> = props => {
  const { room, onFinish } = props;
  const [error, setError] = useState<string | null>(null);

  const [timeFrom, setTimeFrom] = useState<Date>(room.timefrom);
  const [timeTo, setTimeTo] = useState<Date>(room.timeto);
  const [roomCapacity, setRoomCapacity] = useState<string | number>(room.capacity);
  const [roomPrice, setRoomPrice] = useState<string | number>(room.price);
  const [promoCode, setPromoCode] = useState<string>(room.promocode || '');

  function handleSubmit() {
    const noBlank = roomCapacity && roomPrice;
    const timeSet = (timeFrom !== undefined) && (timeTo !== undefined);
    if (noBlank && timeSet) {
      setError(null);
      const formData = {
        timefrom: timeFrom!,
        timeto: timeTo!,
        capacity: parseInt(roomCapacity! as never) || roomCapacity,
        price: parseFloat(roomPrice! as never) || roomPrice,
        promocode: promoCode || null,
        name: room.name
      };
      postData('/api/rooms/update', formData)
      .then(response => {
        if (response.updated) {
          onFinish();
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
      <label>Open From:<TimePicker value={timeFrom} onChange={dt => setTimeFrom(dt)} /></label>
      <label>Open Until:<TimePicker value={timeTo} onChange={dt => setTimeTo(dt)} /></label>
      <label>Capacity:<input type='number' value={roomCapacity} onChange={e => setRoomCapacity(e.target.value)} /></label>
      <label>Price:<input type='number' value={roomPrice} onChange={e => setRoomPrice(e.target.value)} /></label>
      <label>Promo Code (Optional):<input type='text' value={promoCode} onChange={e => setPromoCode(e.target.value)} /></label>
      <div>
        <button onClick={handleSubmit}>Modify</button>
        <button onClick={onFinish}>Cancel</button>
      </div>
    </FormStyles>
  );
}

const YourRooms: FC = () => {
  const { session } = useSession();
  const [editing, setEditing] = useState<IRoomInfo | null>(null);

  const [revenue, setRevenue] = useState<number>(0);
  const [data, setData] = useState<Array<IRoomInfo> | null>(null);
  useEffect(fetchData, [session]);

  function fetchData() {
    if (session) {
      getData(`/api/revenue/${session.username}`)
      .then(({ revenue }) => {
        setRevenue(revenue);
      })
      .catch();

      getData(`/api/rooms/${session.username}`)
      .then((rooms: Array<IRoomInfo>) => {
        setData(rooms.map(room => ({ 
          ...room,
          timefrom: new Date(room.timefrom), 
          timeto: new Date(room.timeto) 
        })));
      })
      .catch();
    }
  }

  function deleteRoom (room: string) {
    postData('/api/rooms/delete', { room })
    .then(response => {
      if (response.deleted) {
        fetchData();
      }
    })
    .catch();
  }

  function launchRoom (room: string) {
    postData('/api/rooms/launch', { room })
    .then(response => {
      if (response.launched) {
        fetchData();
      }
    })
    .catch();
  }

  return (
    <Body>
      <h3>Your Revenue: {toCurrency(revenue)}</h3>
      {editing && <Form room={editing} onFinish={() => {
        setEditing(null);
        fetchData();
      }} />}
      {!data ? <div>loading...</div> : 
      data.length === 0 ? <div>You have not created any rooms.</div> : (
        <Table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Room Capacity</th>
              <th>Price</th>
              <th>Promo Code</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((room, i) => (
              <tr key={i}>
                <td>{room.name}</td>
                <td>{room.timefrom.toLocaleDateString()}</td>
                <td>{`${room.timefrom.toLocaleTimeString()} - ${room.timeto.toLocaleTimeString()}`}</td>
                <td>{room.capacity}</td>
                <td>{toCurrency(room.price)}</td>
                <td>{room.promocode}</td>
                <td>{room.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button onClick={() => setEditing(room)}>Edit</Button>
                  <Button onClick={() => deleteRoom(room.name)}>Delete</Button>
                  <Button disabled={room.active} onClick={() => launchRoom(room.name)}>Launch</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Body>
  );
}

export default YourRooms;

const Body = styled.div`
  > h3 {
    margin: 0;
    margin-bottom: 5px;
  }

  > table {
    td:last-child {
      width: 1%;
      white-space: nowrap;
      padding: 0 20px;
    }

    button {
      width: 80px;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
`;