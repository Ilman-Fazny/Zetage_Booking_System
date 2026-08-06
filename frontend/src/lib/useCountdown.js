// src/lib/useCountdown.js
import { useState, useEffect } from "react";

export function useCountdown(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDateStr));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateStr));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  return timeLeft;
}

function calculateTimeLeft(targetDateStr) {
  // We specify the target date. 
  // If no time is provided, we default to 18:00 (6:00 PM) Sri Lanka time (GMT+5:30)
  // Let's create a date object. If the string is just "September 6, 2026", it parses at midnight local.
  // So we explicitly create a Date object in Sri Lanka time (or just local time).
  // "September 6, 2026 18:00:00 GMT+0530"
  let target = new Date(`${targetDateStr} 18:00:00 GMT+0530`);
  
  // fallback if parsing fails
  if (isNaN(target.getTime())) {
    target = new Date(targetDateStr);
  }

  const difference = target - new Date();
  
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  // If time is up
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}
