import { useState, useEffect } from 'react';
import { fetchData } from '../helpers';
import Nav from '../components/Nav';

export default function Main({ children }) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const userName = fetchData("userName");
    setUserName(userName);
  }, []);

  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        {children}
      </main>
    </div>
  );
}