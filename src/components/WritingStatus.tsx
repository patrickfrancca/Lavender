"use client";

import { useEffect, useState } from "react";

export function useWritingStatus() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const checkCompletion = () => {
      const lastCompletion = localStorage.getItem("writingCompletedDate");
      if (lastCompletion) {
        const lastDate = new Date(lastCompletion);
        const today = new Date();
        const isSameDay = lastDate.toDateString() === today.toDateString();
        setIsCompleted(isSameDay);
        
        if (isSameDay) {
          const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            
            const diff = midnight.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            setTimeLeft(`${hours}h ${minutes}m`);
          };
          
          updateTimer();
          const timerId = setInterval(updateTimer, 60000);
          return () => clearInterval(timerId);
        }
      }
    };

    checkCompletion();
    window.addEventListener("storage", checkCompletion);
    return () => window.removeEventListener("storage", checkCompletion);
  }, []);

  return { isCompleted, timeLeft };
}