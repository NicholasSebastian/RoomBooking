import { FC, useState } from 'react';
import styled from 'styled-components';

type DateClickedEvent = (date: Date) => void;

interface ICalendarProps {
  onClick?: DateClickedEvent
}

const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function renderCells (y: number, m: number, onClick: DateClickedEvent) {
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const rows = [];
  for (let i = -firstDay.getDay() + 1; i <= lastDay.getDate(); i += daysOfTheWeek.length) {
    const cells = [];
    for (let j = i; j < i + daysOfTheWeek.length; j++) {
      const isDate = j > 0 && j <= lastDay.getDate();
      const isToday = j === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      cells.push(
        <td key={j} onClick={isDate ? () => onClick(new Date(y, m, j)) : undefined}
          className={`${isDate ? 'active' : undefined} ${isToday ? 'today' : undefined}`}>
          <span>{isDate && j}</span>
        </td>
      );
    }
    rows.push(<tr key={i}>{cells}</tr>);
  }

  return rows;
}

const Calendar: FC<ICalendarProps> = props => {
  const { onClick } = props;

  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());

  const clickHandler: DateClickedEvent = date => { if (onClick) onClick(date) }

  function incrementDown() {
    if (month === 0) {
      setMonth(months.length - 1);
      setYear(year - 1);
    }
    else {
      setMonth(month - 1);
    }
  }

  function incrementUp() {
    if (month === months.length - 1) {
      setMonth(0);
      setYear(year + 1);
    }
    else {
      setMonth(month + 1);
    }
  }

  return (
    <Body>
      <div>
        <button onClick={incrementDown}>{'<<'}</button>
        <h2>{`${months[month]} ${year}`}</h2>
        <button onClick={incrementUp}>{'>>'}</button>
      </div>
      <table>
        <thead><tr>{daysOfTheWeek.map(day => <th key={day}>{day}</th>)}</tr></thead>
        <tbody>{renderCells(year, month, clickHandler)}</tbody>
      </table>
    </Body>
  );
}

export default Calendar;

const Body = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 25px 1fr;
  row-gap: 5px;

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    > button {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      height: 100%;
      padding: 0 10px;
      font-weight: 600;

      &:hover {
        cursor: pointer;
        background-color: #ddd;
      }
    }

    > h2 { 
      margin: 0; 
      font-size: 30px;
      font-weight: 500;
      font-family: 'Times New Roman', serif;
    }
  }

  > table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th, td {
      border: 1px solid #ccc;
    }

    td {
      vertical-align: top;
      padding: 5px;

      &.today {
        > span {
          position: relative;

          &::after {
            content: "◯";
            color: #d63d07;
            position: absolute;
            top: -2px;
            left: 0;
            transform: scale(2);
          }
        }
      }

      &.active {
        transition: all 100ms linear;

        &:hover {
          cursor: pointer;
          background-color: #677683;
          font-weight: 600;

          > span { color: #fff; }
        }
      }

      &:not(.active) {
        background-color: #eee;
      }
    }
  }
`;