import { FC } from 'react';
import styled from 'styled-components';
import useSession from '../lib/useSession';

interface ILayoutProps {
  title: string
}

const Component: FC<ILayoutProps> = props => {
  const { session, setSession } = useSession();
  return (
    <Layout>
      <Header>
        <h1>UOW Room Booking Services</h1>
        {session && (
          <div>
            Logged in as {session.username}
            <div>
              <button onClick={() => setSession!(null)}>Logout</button>
            </div>
          </div>
        )}
      </Header>
      <Title>{props.title}</Title>
      <main className={(props as any).className}>{props.children}</main>
      <Footer>CSIT214 Group Assignment - 2021 OneeChan Group</Footer>
    </Layout>
  );
}

export default Component;

const Layout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  > main {
    flex: 1;
  }
`;

const Header = styled.header`
  background-color: #222323;
  border-bottom: 4px solid #d53c05;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  > h1 {
    color: #fff;
    margin: 0;
    font-size: 30px;
    font-weight: 500;
    font-family: 'Times New Roman', serif;
  }

  > div {
    color: #ddd;
    position: relative;

    &::after {
      content: '▼';
      font-size: 8px;
      margin-left: 5px;
    }

    &:hover {
      cursor: pointer;
      color: #fff;

      > div {
        display: block !important;
      }
    }

    > div {
      display: none;
      position: absolute;
      right: 0;
      background-color: #fff;
      border: 1px solid #ccc;

      > button {
        background: transparent;
        border: none;
        width: 200px;
        margin: 5px 0;
        padding: 5px 0;
        font-size: 16px;

        &:hover {
          cursor: pointer;
          background-color: #eee;
        }
      }
    }
  }
`;

const Title = styled.h2`
  margin: 0 10px;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
  color: #222323;
  font-size: 30px;
  font-weight: 500;
  font-family: 'Times New Roman', serif;
  text-transform: capitalize;
`;

const Footer = styled.footer`
  background-color: #222323;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  font-family: Verdana, Geneva, sans-serif;
`;