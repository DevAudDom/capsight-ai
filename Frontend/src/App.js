// App component defines top-level layout and client-side routing.
// React Router v6 is used here to navigate between pages.
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Grade from './pages/Grade';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      {/* Header is visible on every page */}
      <Header />

      {/* Simple nav to demonstrate route links */}
      <nav className="nav">
        {/* Link components change the URL without a full page reload */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/grade">Grade</Link>
      </nav>

      {/* Route table: add new routes as the app grows */}
      <main className="content">
        <Routes>
          {/* Index route maps to the home page */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/grade" element={<Grade />} />
          {/* Catch-all route for unmatched paths could be added here */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;


