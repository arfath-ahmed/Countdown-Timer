import React from 'react';

export default function TimerList({ timers, onDelete, onStopAlarm}) {
  return (
    <div className="timers">
      {timers.length === 0 && <p className="timer-text">No timers added yet.</p>}
      {timers.map((timer) => {
        const showStopAlarm = timer.isRinging;

        return (
          <div key={timer.id} className="timer-card">
            <h2>{timer.timeLeft ? timer.name : <s>{timer.name}</s> }</h2>
            {timer.timeLeft ? (
              <div>
                <div className="countdown">
                  <span>{timer.timeLeft.days}d</span>
                  <span>{timer.timeLeft.hours}h</span>
                  <span>{timer.timeLeft.minutes}m</span>
                  <span>{timer.timeLeft.seconds}s</span>
                </div>
                <div className="button-row single-button">
                  <button onClick={() => onDelete(timer.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>Rang on {new Date(timer.targetDate).toLocaleDateString()} at {new Date(timer.targetDate).toLocaleTimeString()}</p>
                <div className={`button-row ${showStopAlarm ? 'two-buttons' : 'single-button'}`}>
                  <button onClick={() => onDelete(timer.id)} className="delete-button">
                    Delete
                  </button>
                  {showStopAlarm && (
                    <button
                      onClick={() => onStopAlarm(timer.id)}
                      className="stop-alarm-button"
                    >
                      Stop Alarm
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
