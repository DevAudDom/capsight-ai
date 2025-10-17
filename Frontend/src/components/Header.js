// Header renders the app title and serves as a persistent layout element.
// In larger apps, this can include menus, user profile, and breadcrumbs.
import React from 'react';

function Header() {
  return (
    <header style={{ background: '#111827', color: 'white', padding: '0.75rem 1rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem' }}>CapsightAI</h1>
      <p style={{ margin: 0 }} className="muted">React + FastAPI scaffold</p>
    </header>
  );
}

export default Header;


