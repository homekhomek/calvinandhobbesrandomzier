import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, IndexRoute } from 'react-router-dom';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;