// DataCard is a reusable presentational component to display a title and body.
// Demonstrates small, composable components that accept props.
import React from 'react';

function DataCard({ title, children }) {
  return (
    <section className="card" aria-label={title}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default DataCard;


