import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th, td {
    border: 1px solid #ccc;
    text-align: center;

    &:first-child {
      text-align: left;
      padding-left: 10px;
    }
  }

  th {
    background-color: #01668c;
    color: #fff;
    padding: 10px 0;
  }

  td {
    padding: 15px 0;
  }
`;

export default Table;