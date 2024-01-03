import BigNumber from 'bignumber.js';
import { getAddress } from 'ethers/lib/utils';
import { MutableRefObject } from 'react';
import { Token } from 'types/assets';

export const returnNumOrDash = (num: string) =>
  new BigNumber(num).gt(0) ? num : '-';

export const returnBigNumberOrZero = (num: any) => {
  const bnNum = new BigNumber(num);
  return !isNaN(bnNum.toNumber()) ? bnNum : new BigNumber(0);
};

export function getLastDayOccurence(date: Date, day: string) {
  const d = new Date(date.getTime());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
  if (days.includes(day)) {
    const modifier = (d.getDay() + days.length - days.indexOf(day)) % 7;
    d.setDate(d.getDate() - modifier);
  }
  return d;
}

export function formatCurrency(
  amount: any,
  decimals = 2,
  formatTinyAmounts = true,
) {
  if (amount === '0') {
    return '0.00';
  }
  if (!isNaN(amount)) {
    if (
      new BigNumber(amount).gt(0) &&
      new BigNumber(amount).lt(new BigNumber(1).div(Math.pow(10, decimals))) &&
      formatTinyAmounts
    ) {
      return `< ${new BigNumber(1).div(Math.pow(10, decimals)).toFixed()}`;
    }

    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount);
  } else {
    return '0.00';
  }
}

export function formatAddress(address: string, length = 'short') {
  try {
    if (address && length === 'short') {
      address =
        address.substring(0, 6) +
        '...' +
        address.substring(address.length - 4, address.length);
      return address;
    } else if (address && length === 'long') {
      address =
        address.substring(0, 12) +
        '...' +
        address.substring(address.length - 8, address.length);
      return address;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export function bnDec(decimals: string) {
  return new BigNumber(10).pow(parseInt(decimals));
}

export function multiplyBnToFixed(...args: any[]) {
  if (args.length < 3)
    throw new Error(
      'multiplyBnToFixed needs at least 3 arguments: first bn, second bn to multiply with first, and number of decimals.',
    );

  const decimals = args[args.length - 1];
  const bigNumbers = args.slice(0, -1);

  return bnToFixed(
    multiplyArray(bigNumbers),
    decimals * bigNumbers.length,
    decimals,
  );
}

export function sumArray(numbers: any[]) {
  return numbers.reduce((total, n) => total + Number(n), 0);
}

export function bnToFixed(
  bn: any,
  decimals: number,
  displayDecimals = decimals,
) {
  const bnDecimals = new BigNumber(10).pow(decimals);

  return new BigNumber(bn)
    .dividedBy(bnDecimals)
    .toFixed(displayDecimals, BigNumber.ROUND_DOWN);
}

export function floatToFixed(float: number, decimals = 0) {
  return new BigNumber(float).toFixed(decimals, BigNumber.ROUND_DOWN);
}

export function multiplyArray(numbers: number[]) {
  return numbers.reduce((total, n) => total * n, 1);
}

export function isAddress(address: string) {
  try {
    getAddress(address);
    return true;
  } catch (error) {
    console.warn('warn@isAddress', error);
  }
  return false;
}

export function getAddressSafe(address: string) {
  try {
    return getAddress(address);
  } catch (error) {
    return address;
  }
}

export const sortsBefore = (tokenA: Token, tokenB: Token) => {
  tokenA?.address.toLowerCase() < tokenB?.address.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
};

export const sortsBeforeComp = (tokenA: Token, tokenB: Token) => {
  return tokenA?.address.toLowerCase() < tokenB?.address.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
};
export const doesTokenSortBefore = (tokenA: Token, tokenB: Token) => {
  return tokenA?.address.toLowerCase() < tokenB?.address.toLowerCase()
    ? true
    : false;
};

export function toHex(currencyAmount: BigNumber) {
  return `0x${currencyAmount.toString(16)}`;
}

const locales = ['en-US'];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4) {
  try {
    const parsed = getAddress(address);
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(
      42 - chars,
    )}`;
  } catch (error) {
    return `${address.substring(0, chars + 2)}...${address.substring(
      42 - chars,
    )}`;
  }
}

export function scrollWithOffset(ref: MutableRefObject<any>, yOffset = 0) {
  return () => {
    try {
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };
}

export const retryInterval = (
  cb: () => void,
  duration = 5,
  opts?: { interval?: number; initialDelay?: number },
) => {
  const interval = opts?.interval || 1;
  const initialDelay = opts?.initialDelay || 1;

  setTimeout(() => {
    const intervalId = setInterval(cb, interval * 1000);
    setTimeout(() => {
      clearInterval(intervalId);
    }, duration * 1000);
  }, initialDelay * 1000);
};

export const formatUnixTime = (timestamp: number | number[]): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  if (Array.isArray(timestamp)) {
    timestamp = Math.min(...timestamp);
  }

  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
};

export const formatToDays = (timestamps: number[]) => {
  const currentDate = new Date();
  const oneDay = new BigNumber(24).times(60).times(60);

  // Convert to an array if the input is not already an array
  const timestampArr = Array.isArray(timestamps) ? timestamps : [timestamps];

  const daysFromNow = timestampArr.map((timestamp) => {
    //@ts-ignore
    const targetDate = new Date(parseInt(timestamp) * 1000);
    const timeDiff = new BigNumber(
      targetDate.getTime() - currentDate.getTime(),
    ).dividedBy(1000);
    const daysDiff = timeDiff
      .dividedBy(oneDay)
      .integerValue(BigNumber.ROUND_CEIL); // Convert the time difference to days (rounding up)

    return !isNaN(daysDiff.toNumber()) ? `${daysDiff}D` : '0D';
  });

  return daysFromNow.flat().join(' ⏺ ');
};

export const formatTimestampToDays = (timestamp: number) => {
  const now = new BigNumber(Date.now()).div(1000);
  const inputTimestamp = new BigNumber(timestamp);
  const timeDifference = inputTimestamp.minus(now);

  const days = Math.floor(timeDifference.div(86400).toNumber());
  const remainingHours = Math.floor(
    timeDifference.mod(86400).div(3600).toNumber(),
  );
  const remainingMinutes = Math.floor(
    timeDifference.mod(3600).div(60).toNumber(),
  );
  const timeArray = [];

  if (timeDifference.lte(0)) {
    return 'Expired';
  } else if (days >= 1) {
    timeArray.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (remainingHours > 0) {
      timeArray.push(
        `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`,
      );
    }
    return timeArray.join(', ');
  } else {
    if (remainingHours > 0) {
      timeArray.push(
        `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`,
      );
    }
    if (remainingMinutes > 0) {
      timeArray.push(
        `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`,
      );
    }
    return timeArray.join(', ');
  }
};

export default function formatTimestamp(timestamp: string) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedTimestamp = new Date(Number(timestamp) * 1000).toLocaleString(
    'en-US',
    options,
  );

  return formattedTimestamp.replace(',', '').replace(',', ' |');
}

export const formatTimestampToDate = (timestamp: number) =>
  new Date(timestamp).toUTCString().replace('GMT', 'UTC');

export const formatTimestampToDuration = (timestamp: number) => {
  return timestamp / 2629800 >= 1
    ? `${formatCurrency(timestamp / 2629800, 0)} month${
        Math.floor(new BigNumber(timestamp).div(2629800).toNumber()) > 1
          ? 's'
          : ''
      }`
    : `${formatCurrency(timestamp / 86400, 0)} day${
        Math.floor(new BigNumber(timestamp).div(86400).toNumber()) > 1
          ? 's'
          : ''
      }`;
};

export function compactCurrency(
  amount: any,
  decimals = 2,
  formatTinyAmounts = true,
) {
  if (amount === '0') {
    return '0.00';
  }
  if (!isNaN(amount)) {
    if (
      new BigNumber(amount).gt(0) &&
      new BigNumber(amount).lt(new BigNumber(1).div(Math.pow(10, decimals))) &&
      formatTinyAmounts
    ) {
      return `< ${new BigNumber(1).div(Math.pow(10, decimals)).toFixed()}`;
    }

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(amount);
  } else {
    return '0.00';
  }
}
