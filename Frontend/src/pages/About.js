// About page: static content to demonstrate a simple route.
import React from 'react';
import DataCard from '../components/DataCard';

function About() {
  return (
    <DataCard title="About">
      <p>
        This project scaffolds a minimal, educational React + FastAPI app.
        Explore the code to learn structure, routing, and API integration.
      </p>
    </DataCard>
  );
}

export default About;


