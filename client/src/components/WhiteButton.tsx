import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 0;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-weight: 600;
  text-transform: uppercase;

  &:not(:disabled) {
    background-color: #fff;

    &:hover {
      cursor: pointer;
      background-color: #ddd;
    }
  }

  &:disabled {
    background-color: #ddd;
  }
`;

export default Button;