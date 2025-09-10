import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Vite's proxy will forward this to http://localhost:3000
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to fetch from API'));
  }, []);

  return <h1>Wow&apos;zas! {message}</h1>;
}

export default App;
