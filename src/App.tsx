import { FC, useState, createContext } from 'react';
import Main from './pages/Main';
import Login from './pages/Login';

type Session = ISession | null

interface ISession {
  username: string
  role: 'staff' | 'student'
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
        <Login login={id => setSession({ 
          username: id, 
          role: Math.random() > 0.5 ? 'staff' : 'student' // TODO: change this.
        })} />
      )}
    </SessionContext.Provider>
  )
}

export { SessionContext };
export default App;
