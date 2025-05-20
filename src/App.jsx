// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import AddTimerForm from './AddTimerForm';
import TimerList from './TimerList';
import './App.css';
import db from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

function App() {
  const [timers, setTimers] = useState([]);
  const alarmAudio = useRef(null);

  useEffect(() => {
    const audio = new Audio('/alarm-sound.mp3');
    audio.loop = true;
    alarmAudio.current = audio;
  }, []);

  // Fetch timers from Firestore on load
  useEffect(() => {
    const fetchTimers = async () => {
      const querySnapshot = await getDocs(collection(db, 'timers'));
      const loadedTimers = [];
      querySnapshot.forEach((docSnap) => {
        loadedTimers.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTimers(loadedTimers);
    };

    fetchTimers();
  }, []);

  // Countdown interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          const now = new Date().getTime();
          const target = new Date(timer.targetDate).getTime();
          const difference = target - now;

          if (difference <= 0) {
            if (timer.isStopped) {
              return { ...timer, timeLeft: null, isRinging: false };
            }

            if (!timer.isRinging) {
              alarmAudio.current.play();
            }

            return { ...timer, timeLeft: null, isRinging: true };
          }

          return {
            ...timer,
            timeLeft: {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / (1000 * 60)) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            },
            isRinging: false,
            isStopped: false,
          };
        })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      alarmAudio.current.pause();
      alarmAudio.current.loop = true;
    };
  }, []);

  const handleAddTimer = async ({ name, targetDate }) => {
    const newTimer = {
      name,
      targetDate,
      timeLeft: {},
      isRinging: false,
      isStopped: false,
    };

    const docRef = await addDoc(collection(db, 'timers'), newTimer);
    setTimers((prev) => [...prev, { ...newTimer, id: docRef.id }]);
  };

  const deleteTimer = async (id) => {
    if (window.confirm('Are you sure you want to delete the timer?')) {
      await deleteDoc(doc(db, 'timers', id));
      setTimers((prev) => prev.filter((timer) => timer.id !== id));
    }
  };

  const stopAlarm = async (id) => {
    alarmAudio.current.pause();
    alarmAudio.current.currentTime = 0;

    await updateDoc(doc(db, 'timers', id), {
      isStopped: true,
      isRinging: false,
    });

    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, isRinging: false, isStopped: true }
          : timer
      )
    );
  };

  return (
    <div className="app">
      <AddTimerForm onAdd={handleAddTimer} />
      <TimerList
        timers={timers}
        onDelete={deleteTimer}
        onStopAlarm={stopAlarm}
      />
    </div>
  );
}

export default App;
