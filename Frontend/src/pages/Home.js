// Home page demonstrates fetching data from the backend and managing async state.
// We use a simple useEffect + useState pattern to load data on mount.
import React from 'react';
import DataCard from '../components/DataCard';
import { getHello } from '../services/api';

function Home() {
  const [message, setMessage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    // Async IIFE keeps effect callback synchronous while allowing async work
    (async () => {
      try {
        const data = await getHello();
        if (isMounted) setMessage(data.message);
      } catch (err) {
        if (isMounted) setError(err?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    // Cleanup prevents state updates on unmounted components
    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      <DataCard title="Welcome">
        <p>This is the React front end. Use the nav to switch pages.</p>
      </DataCard>
    </div>
  );
}

export default Home;


