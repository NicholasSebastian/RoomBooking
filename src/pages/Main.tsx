import { FC, Fragment, useContext, useState } from 'react';
import styled from 'styled-components';

import { SessionContext } from '../App';
import Layout from '../components/Layout';

interface IMainProps {
  logout: () => void
}

interface IButtonProps {
  index: number
}

interface IButtonStyleProps extends IButtonProps {
  currentIndex: number
}

const Main: FC<IMainProps> = () => {
  const { session } = useContext(SessionContext);
  const [page, setPage] = useState<number>(0);

  const Button: FC<IButtonProps> = props => (
    <SideButton index={props.index} currentIndex={page} 
      onClick={() => setPage(props.index)}>
      {props.children}
    </SideButton>
  );

  return (
    <StyledLayout title={session!.role === 'staff' ? "Staff Services" : "Student Services"}>
      <aside>
        {session!.role === 'staff' ? (
          <Fragment>
            <Button index={0}>Create new Room</Button>
            <Button index={1}>Room Settings</Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button index={0}>View Calendar</Button>
            <Button index={1}>View Available Rooms</Button>
            <Button index={2}>Booking History</Button>
          </Fragment>
        )}
      </aside>
      <main>
        body
      </main>
    </StyledLayout>
  );
}

export default Main;

const StyledLayout = styled(Layout)`
  display: grid;
  grid-template-columns: 240px 1fr;

  > aside {
    border-right: 1px solid #ddd;
    padding: 10px;
  }

  > main {
    // here
  }
`;

const SideButton = styled.button<IButtonStyleProps>`
  background: ${({ index, currentIndex }) => (
    index === currentIndex ? '#ddd' : 'transparent'
  )};
  border: none;
  border-bottom: 1px dashed #ddd;
  display: block;
  width: 100%;
  padding: 8px 10px;
  font-size: 16px;
  text-align: left;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
`;