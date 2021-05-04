import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import Table from '../../components/Table';
import Button from '../../components/WhiteButton';

import postData, { getData } from '../../lib/post';
import useSession from '../../lib/useSession';

// TODO: 'booked' count is still 0 on all tables.
// TODO: prevent booking if capacity is full.
// TODO: implement promo codes.
// TODO: 'modify' existing booking.

interface IBooking {
  bookingid: string
  roomname: string
  timefrom: Date
  timeto: Date
  purchasedate: Date
}

const BookingHistory: FC = () => {
  const { session } = useSession();
  const [data, setData] = useState<Array<IBooking> | null>(null);
  useEffect(fetchData, [session]);

  function fetchData() {
    if (session) {
      getData(`/api/booking/${session.username}`)
      .then((bookings: Array<any>) => {
        setData(bookings.map(booking => ({
          ...booking,
          timefrom: new Date(booking.timefrom),
          timeto: new Date(booking.timeto),
          purchasedate: new Date(booking.purchasedate)
        })));
      })
      .catch();
    }
  }

  function handleDelete (booking: string) {
    postData('/api/booking/delete', { booking })
    .then(response => {
      if (response.deleted) {
        fetchData();
      }
    })
    .catch();
  }

  return (
    <Body>
      <h3>Your Booking History</h3>
      {!data ? <div>loading...</div> : 
      data.length === 0 ? <div>You have no Bookings</div> : (
        <Table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Booked On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data
            .sort((a, b) => a.purchasedate.getTime() - b.purchasedate.getTime())
            .map((booking, i) => (
              <tr key={i}>
                <td>{booking.bookingid}</td>
                <td>{booking.roomname}</td>
                <td>{booking.timefrom.toLocaleDateString()}</td>
                <td>{`${booking.timefrom.toLocaleTimeString()} - ${booking.timeto.toLocaleTimeString()}`}</td>
                <td>{booking.purchasedate.toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => handleDelete(booking.bookingid)}>Cancel</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Body>
  );
}

export default BookingHistory;

const Body = styled.div`
  > h3 {
    margin: 0;
    margin-bottom: 5px;
  }

  > table {
    td:first-child {
      width: 1%;
      white-space: nowrap;
      padding-right: 20px;
    }

    td:last-child {
      width: 1%;
      padding: 0 20px;
    }

    button {
      width: 80px;
    }
  }
`;