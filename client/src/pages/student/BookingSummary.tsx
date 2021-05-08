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
  const [promoCode, setPromoCode] = useState<string>('');
  const [invalidCode, setInvalidCode] = useState<boolean>(false);

  async function handlePayment() {
    setInvalidCode(false);
    const data = {
      user: session?.username,
      room: booking.name,
      price: booking.price,
      date: new Date()
    };

    try {
      if (promoCode.length > 0) {
        const { valid } = await postData('/api/booking/checkpromo', { code: promoCode });
        if (valid) {
          data.price = 0;
        }
        else {
          setInvalidCode(true);
          return;
        }
      }
      
      const { bookingId } = await postData('/api/booking/create', data);
      if (bookingId) {
        setOrderComplete(bookingId);
      }
    }
    catch(e) {}
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
      <div>
        <label>
          Promo Code (Optional):
          <input type='text' value={promoCode} onChange={e => setPromoCode(e.target.value)} />
        </label>
      </div>
      {invalidCode && <span>Invalid Promo Code</span>}
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

    > div:nth-child(odd) {
      text-align: right;
      font-weight: 600;
    }
  }

  > div:nth-child(3) {
    margin-top: 30px;
    margin-bottom: 10px;

    > label {
      text-align: right;
      font-weight: 600;

      > input[type='text'] {
        width: 150px;
        border: 1px solid #ccc;
        border-radius: 2px;
        margin-left: 50px;
        padding: 8px;

        &:focus {
          outline: none;
          border-color: #66aee9;
          box-shadow: 0 0 5px#66aee9;
        }
      }
    }
  }

  > span:last-of-type {
    color: red;
    font-size: 14px;
  }

  > div:last-child {
    margin-top: 5px;

    > button {
      margin: 0 5px;
    }
  }
`;