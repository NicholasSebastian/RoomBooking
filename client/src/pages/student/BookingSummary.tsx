import { FC, useState } from 'react';
import styled from 'styled-components';

import { IRoomInfo } from '../Main';
import Payment from './Payment';
import Button from '../../components/DarkButton';

import postData from '../../lib/post';
import useSession from '../../lib/useSession';
import toCurrency from '../../lib/currency';

interface IBookingProps {
  booking: IRoomInfo
  cancel: () => void
  paid: boolean
}

const BookingSummary: FC<IBookingProps> = props => {
  const { booking, cancel, paid} = props;
  const { session } = useSession();
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  function handlePayment() {
    const data = {
      user: session?.username,
      room: booking.name,
      price: booking.price,
      date: new Date()
    };
    postData('/api/booking/create', data)
    .then(response => {
      if (response.bookingId) {
        setOrderComplete(response.bookingId);
      }
    })
    .catch();
  }

  return orderComplete ? (
    <Payment bookingId={orderComplete} close={cancel} />
  ) : (
    <Body>
      <h2>Booking Summary</h2>
      <div>
        <div>Room Name:</div>
        <div>{booking.name}</div>
        <div>Date:</div>
        <div>{booking.timefrom.toLocaleDateString()}</div>
        <div>Time:</div>
        <div>{`${booking.timefrom.toLocaleTimeString()} - ${booking.timeto.toLocaleTimeString()}`}</div>
        <div>Hosted by:</div>
        <div>{booking.host}</div>
        <div>Price:</div>
        <div>{toCurrency(booking.price)}</div>
      </div>
      {!paid && (
        <div>
          <Button onClick={handlePayment}>Proceed to Payment</Button>
          <Button onClick={cancel}>Cancel</Button>
        </div>
      )}
    </Body>
  );
}

export default BookingSummary;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > h2 {
    margin: 0;
  }

  > div:nth-child(2) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 50px;
    row-gap: 15px;
    margin-top: 30px;
    margin-bottom: 50px;

    > div:nth-child(odd) {
      text-align: right;
      font-weight: 600;
    }
  }

  > div:last-child {
    > button {
      margin: 0 5px;
    }
  }
`;