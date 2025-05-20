import React, { useState } from 'react';

export default function AddTimerForm({ onAdd }) {
  const [name, setName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !targetDate) {
      alert('Please fill both fields');
      return;
    }
    const now = new Date().getTime();
    if (new Date(targetDate).getTime() <= now) {
      alert('Please select a future date/time');
      return;
    }
    onAdd({ name, targetDate });
    setName('');
    setTargetDate('');
  };

  return (
    <div className="form-container">
    <h1>⏳ Countdown Timer</h1>
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Timer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="datetime-local"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
      />
      <button type="submit">Add Timer</button>
    </form>
    </div>
  );
}
