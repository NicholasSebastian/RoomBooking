import { FC, useState, createContext } from 'react';
import Main from './pages/Main';
import Login from './pages/Login';

// TODO: 'booked' count is still 0 on all tables.
// TODO: prevent booking if capacity is full.
// TODO: implement promo codes.
// TODO: 'modify' existing booking.

type Session = ISession | null
type Role = 'staff' | 'student'

interface ISession {
  username: string
  role: Role
}

interface IGlobalSession {
  session: Session
  setSession: React.Dispatch<React.SetStateAction<Session>> | null
}

const SessionContext = createContext<IGlobalSession>({ session: null, setSession: null });

const App: FC = () => {
  const [session, setSession] = useState<Session>(null);
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {session ? (
        <Main logout={() => setSession(null)} />
      ) : (
        <Login login={(id, role) => setSession({ username: id, role })} />
      )}
    </SessionContext.Provider>
  )
}

export { SessionContext };
export type { Role };
export default App;
