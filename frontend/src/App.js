import React from 'react';
import './App.css';
import Data from './components/main.js'; // Import the left side component (upload data)

function App() {
  return (
    <div className="App">
      <div className="left-side">
        <Data />  {/* Left side with upload data */}
      </div>
      <div className="right-side">
        {/* Right side content will be added later */}
      </div>
    </div>
  );
}

export default App;
