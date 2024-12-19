// components/CountdownTimer.tsx
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  expiresAt: string;
}

export const CountdownTimer = ({ expiresAt }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeLeft("期限切れ");
        return;
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`${minutes}分${seconds}秒`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-sm">{timeLeft}</span>;
};
