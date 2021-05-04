import styled from 'styled-components';

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;

  > div:first-child {
    background-color: #f2dedd;
    color: #aa4442;
    border: 1px solid #ebccd1;
    border-radius: 2px;
    margin-bottom: 16px;
    padding: 10px 0;
    width: 650px;
    font-size: 14px;
    text-align: center;
  }

  > label {
    width: 650px;
    text-align: right;
    font-weight: 600;
    margin-bottom: 12px;

    > input[type='text'],
    > input[type='number'] {
      width: 450px;
      border: 1px solid #ccc;
      border-radius: 2px;
      margin-left: 20px;
      padding: 8px;

      &:focus {
        outline: none;
        border-color: #66aee9;
        box-shadow: 0 0 5px#66aee9;
      }
    }
  }

  > div:last-child {
    > button {
      background-color: #509e04;
      color: #fff;
      border: none;
      border-radius: 2px;
      width: 180px;
      padding: 12px 0;
      margin: 0 6px;
      font-weight: 600;
      text-transform: uppercase;

      &:hover {
        cursor: pointer;
        background-color: darkgreen;
      }
    }
  }
`;

export default Form;