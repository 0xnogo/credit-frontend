import { useEffect, useMemo, useState } from 'react';

const useCountdown = (targetDate: number) => {
  const countDownDate = useMemo(
    () => new Date(targetDate * 1000).getTime(),
    [targetDate],
  );

  const [countDown, setCountDown] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownDate - new Date().getTime() <= 0) clearInterval(interval);
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown };
