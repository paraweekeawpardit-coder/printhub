'use client';

interface PaymentTimerProps {
  timeLeft: number;
}

export function PaymentTimer({ timeLeft }: PaymentTimerProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="text-sm text-gray-500">
      เวลารอการชำระเงิน: <span className="font-bold text-red-500">{formatTime(timeLeft)} น.</span>
    </div>
  );
}