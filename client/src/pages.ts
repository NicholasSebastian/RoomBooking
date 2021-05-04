import { FC, lazy } from 'react';
import { Role } from './App';

type Pages = { [key in Role]: Array<IPage> }

interface IPage {
  name: string
  page: React.LazyExoticComponent<FC>
}

const pages: Pages = {
  staff: [
    {
      name: "Create New Rooms",
      page: lazy(() => import('./pages/staff/CreateRoom'))
    },
    {
      name: "Your Rooms",
      page: lazy(() => import('./pages/staff/YourRooms'))
    }
  ],
  student: [
    {
      name: "View Calendar",
      page: lazy(() => import('./pages/student/ViewCalendar'))
    },
    {
      name: "Booking History",
      page: lazy(() => import('./pages/student/BookingHistory'))
    }
  ]
};

export default pages;