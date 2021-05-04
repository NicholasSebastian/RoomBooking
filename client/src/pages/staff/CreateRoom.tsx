import { FC, useState } from 'react';
import Calendar from '../../components/Calendar';
import Timetable from './Timetable';

const CreateRoom: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (selectedDate) {
    return <Timetable date={selectedDate} close={() => setSelectedDate(null)} />
  }
  return <Calendar onClick={date => setSelectedDate(date)} />
}

export default CreateRoom;
