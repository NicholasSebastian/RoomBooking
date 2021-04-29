import { useContext } from 'react';
import { SessionContext } from '../App';

function useSession() {
  const { session, setSession } = useContext(SessionContext);
  return { session, setSession };
}

export default useSession;