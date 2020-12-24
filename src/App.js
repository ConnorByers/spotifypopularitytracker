import React, { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTIme] = useState(0);

  const getTime = ()=>{
    fetch('/time').then(res => res.json()).then(data=>{
      setCurrentTIme(data.time);
    });
  }

  return (
    <div>
      <p>{currentTime}</p>
      <button onClick={getTime}>Click Here</button>
    </div>
  );
}

export default App;
