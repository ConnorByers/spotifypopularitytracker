import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { getDefaultNormalizer } from '@testing-library/react';


function App() {
  const [currentTime, setCurrentTIme] = useState(0);

  const getTime = ()=>{
    fetch('/time').then(res => res.json()).then(data=>{
      setCurrentTIme(data.time);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <p>{currentTime}</p>
        <button onClick={()=>getTime()}>abc</button>
      </header>
    </div>
  );
}

export default App;
