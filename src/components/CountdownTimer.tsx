/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";

const TIMER_DURATION = 10 * 60; // 10 minutos em segundos

interface CountdownTimerProps {
  timerKey: string;
  initialDuration?: number;
}

export default function CountdownTimer({
  timerKey,
  initialDuration = TIMER_DURATION,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [timeExpired, setTimeExpired] = useState(false);

  // Ao montar, carrega o valor salvo (se for hoje) ou reinicia para initialDuration
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storedTimer = localStorage.getItem(timerKey);
    if (storedTimer) {
      try {
        const data = JSON.parse(storedTimer);
        if (data.date === today && typeof data.timeLeft === "number") {
          setTimeLeft(data.timeLeft);
        } else {
          setTimeLeft(initialDuration);
          localStorage.setItem(
            timerKey,
            JSON.stringify({ timeLeft: initialDuration, date: today })
          );
        }
      } catch (e) {
        setTimeLeft(initialDuration);
        localStorage.setItem(
          timerKey,
          JSON.stringify({ timeLeft: initialDuration, date: today })
        );
      }
    } else {
      setTimeLeft(initialDuration);
      localStorage.setItem(
        timerKey,
        JSON.stringify({ timeLeft: initialDuration, date: today })
      );
    }
  }, [timerKey, initialDuration]);

  // Decrementa o timer somente se a página estiver visível
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") {
        // Pausa se a página não estiver visível
        return;
      }
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          const today = new Date().toISOString().split("T")[0];
          localStorage.setItem(
            timerKey,
            JSON.stringify({ timeLeft: 0, date: today })
          );
          setTimeExpired(true);
          return 0;
        }
        const newTime = prevTime - 1;
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem(
          timerKey,
          JSON.stringify({ timeLeft: newTime, date: today })
        );
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerKey]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-end">
      <div className="bg-[#B3BAFF] text-white px-3 py-1 rounded-xl shadow text-lg">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
      {timeExpired && (
        <div className="bg-[#B3BAFF] text-white px-3 py-2 rounded-xl text-xs font-medium shadow-sm mt-2">
          ⏳ Time's up! Try a new skill.
        </div>
      )}
    </div>
  );
}
