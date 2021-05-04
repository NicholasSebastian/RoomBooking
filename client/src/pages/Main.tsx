import { FC, Fragment, useState, Suspense } from 'react';
import styled from 'styled-components';

import useSession from '../lib/useSession';
import pages from '../pages';
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

interface IRoomInfo {
  name: string
  timefrom: Date
  timeto: Date
  capacity: number
  host: string
  price: number
  active: boolean
  promocode: string | null
}

const Main: FC<IMainProps> = () => {
  const { session } = useSession();
  const [page, setPage] = useState<number>(0);

  const Button: FC<IButtonProps> = props => (
    <SideButton index={props.index} currentIndex={page} 
      onClick={() => setPage(props.index)}>
      {props.children}
    </SideButton>
  );

  const Content = pages[session!.role][page].page;
  return (
    <StyledLayout title={`${session!.role} services`}>
      <aside>
        {pages[session!.role].map((page, i) => (
          <Button index={i} key={i}>{page.name}</Button>
        ))}
      </aside>
      <main>
        <Suspense fallback={<Fragment/>}>
          <Content />
        </Suspense>
      </main>
    </StyledLayout>
  );
}

export type { IRoomInfo };
export default Main;

const StyledLayout = styled(Layout)`
  display: grid;
  grid-template-columns: 240px 1fr;

  > aside {
    border-right: 1px solid #ddd;
    padding: 10px;
  }

  > main {
    padding: 10px;
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
    background-color: #677683;
    color: #fff;
  }
`;