import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [endTime, setEndTime] = useState(
    new Date().getTime() + 2 * 60 * 60 * 1000 // 2 tiếng từ thời điểm hiện tại
  );
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        // Khi kết thúc thời gian, khởi động lại 2 tiếng tiếp theo
        setEndTime(new Date().getTime() + 2 * 60 * 60 * 1000);
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="bg-pink-200 text-center py-3 px-7 rounded-lg shadow-md">
      <p className="text-gray-800 text-5xl font-medium mb-1">
        {timeLeft.hours.toString().padStart(2, "0")}:
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </p>
      <p className="text-gray-500 text-xl">Kết thúc sau</p>
    </div>
  );
};

export default CountdownTimer;
