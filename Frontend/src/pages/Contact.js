// Contact page: demonstrates controlled form state handling.
import React from 'react';
import DataCard from '../components/DataCard';

function Contact() {
  const [form, setForm] = React.useState({ name: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // In a real app, this would POST to a backend endpoint.
    setSubmitted(true);
  }

  return (
    <DataCard title="Contact">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            <span className="muted">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            />
          </label>
          <label>
            <span className="muted">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            />
          </label>
          <button type="submit" style={{ padding: '0.5rem 0.75rem' }}>Send</button>
        </div>
      </form>

      {submitted && (
        <p style={{ marginTop: 12 }}>Thanks, {form.name}! We'll get back to you soon.</p>
      )}
    </DataCard>
  );
}

export default Contact;


