import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';


import './index.css';

const supabase = createClient('https://cezelpofxigayemihqfg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlemVscG9meGlnYXllbWlocWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNDYwNzcsImV4cCI6MjAyMDcyMjA3N30.3s7C0PPqVOs5jeAon4EGjPXZkJpYMT67Uligp1RrJxw');

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the session when the component mounts
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.session();
      if (error) {
        console.error('Error fetching session:', error.message);
      } else {
        setSession(session);
      }
    };

    fetchSession();

    // Subscribe to changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  return (
    <div>
      {session ? (
        // User is logged in
        <div>
          <p>Welcome, {session.user.email}!</p>
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      ) : (
        // User is not logged in, show authentication UI
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }}  providers={["google"]}/>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
