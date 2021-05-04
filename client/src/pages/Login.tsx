import { FC, useState } from 'react';
import styled from 'styled-components';

import { Role } from '../App';
import Layout from '../components/Layout';
import postData from '../lib/post';

interface ILoginProps {
  login: (id: string, role: Role) => void
}

interface IErrorProps {
  display: boolean
}

const Login: FC<ILoginProps> = ({ login }) => {
  const [mode, setMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('student');

  function handleSubmit() {
    const noBlank = username.length > 0 && password.length > 0;
    if (!noBlank) {
      setError("Username and Password fields cannot be blank.");
      return;
    }

    if (mode) {
      const data = { username, password, role };
      postData('/api/auth/signup', data)
      .then(response => {
        if (response.created) {
          login(username, role as Role);
        }
        else {
          setError("Username already taken.");
        }
      })
      .catch(console.log);
    }
    else {
      const data = { username, password };
      postData('/api/auth/login', data)
      .then(response => {
        if (response.auth) {
          login(username, response.role);
        }
        else {
          setError("Invalid Username or Password. Please try again.");
        }
      })
      .catch(console.log);
    }
  }

  return (
    <StyledLayout title="Login">
      <div>
        <div>{mode ? 'Register' : 'Login'}</div>
        <div>
          <Error display={!!error}>{error}</Error>
          <div>
            <label>Username</label>
            <input type='text' value={username} 
              onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type='password' value={password} 
              onChange={e => setPassword(e.target.value)} />
          </div>
          {mode && (
            <div>
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value='student'>Student</option>
                <option value='staff'>Staff</option>
              </select>
            </div>
          )}
          <div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setMode(!mode)}>{mode ? 'Login' : 'Register'}</button>
          </div>
        </div>
      </div>
      <div>
        <div>Security Warning</div>
        <div>
          <p>
            This website only looks like the UOW SOLS. Its not real.<br/>
            Please do <b>not</b> use your real UOW password.<br/>
            Stored passwords are <b>not</b> encrypted because I'm lazy.
          </p>
        </div>
      </div>
    </StyledLayout>
  );
}

export default Login;

const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  align-items: flex-start;

  > div {
    margin-top: 20px;
    width: 400px;
    border: 1px solid #ccc;
    border-radius: 2px;
    
    > div:first-child {
      background-color: #eee;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      text-transform: uppercase;
      font-size: 16px;
      font-weight: 600;
    }

    > div:last-child {
      display: flex;
      flex-direction: column;
      padding: 10px;
      padding-bottom: 20px;

      > div:not(:last-child):not(:first-child) {
        margin-bottom: 16px;
        display: grid;
        grid-template-columns: 100px 1fr;
        column-gap: 20px;

        > label {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
        }

        > input[type='text'], 
        > input[type='password'],
        > select {
          border: 1px solid #ccc;
          border-radius: 2px;
          padding: 8px;

          &:focus {
            outline: none;
            border-color: #66aee9;
            box-shadow: 0 0 5px#66aee9;
          }
        }

        > input[type='text'], 
        > input[type='password'] {
          background-color: #e7f0fe;
        }
      }

      > div:last-child {
        text-align: right;

        > button {
          width: 100px;
          padding: 10px 0;
          border-radius: 2px;
          font-weight: 600;
          text-transform: uppercase;

          &:first-child {
            background-color: #324045;
            color: #fff;
            border: none;

            &:hover {
              cursor: pointer;
              background-color: #222323;
            }
          }

          &:last-child {
            background-color: #fff;
            border: 1px solid #ccc;
            margin-left: 16px;

            &:hover {
              cursor: pointer;
              background-color: #ddd;
            }
          }
        }
      }
    }

    &:last-child {
      margin-left: 20px;
      border: 1px solid #ebccd1;

      > div:first-child {
        background-color: #f2dedd;
        color: #aa4442;
      }

      p {
        margin: 0;
        line-height: 24px;
      }
    }
  }
`;

const Error = styled.div<IErrorProps>`
  display: ${({ display }) => display ? 'block': 'none'};
  background-color: #f2dedd;
  color: #aa4442;
  border: 1px solid #ebccd1;
  border-radius: 2px;
  margin-bottom: 16px;
  padding: 10px;
  font-size: 14px;
`;