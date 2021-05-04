import styled from 'styled-components';

const Button = styled.button`
  background-color: #324045;
  color: #fff;
  border: none;
  border-radius: 2px;
  padding: 10px 20px;
  font-weight: 600;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
    background-color: #222323;
  }
`;

export default Button;