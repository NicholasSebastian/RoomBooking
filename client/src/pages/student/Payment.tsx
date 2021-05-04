import { FC } from 'react';
import styled from 'styled-components';
import Button from '../../components/DarkButton';

interface IPaymentProps {
  bookingId: string
  close: () => void
}

const Payment: FC<IPaymentProps> = props => {
  const { bookingId, close } = props;
  return (
    <Body>
      <h2>Your Payment is Complete!</h2>
      <p>Your Booking ID is {bookingId}</p>
      <Button onClick={close}>Return</Button>
    </Body>
  );
}

export default Payment;

const Body = styled.div`
  > h2 {
    margin-top: 0;
  }
`;