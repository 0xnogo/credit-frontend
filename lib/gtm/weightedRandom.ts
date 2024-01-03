function weightedRandom(data: any[][]) {
  let total = 0;
  for (let i = 0; i < data.length; ++i) {
    total += data[i][1];
  }

  const threshold = Math.random() * total;

  total = 0;
  for (let i = 0; i < data.length - 1; ++i) {
    total += data[i][1];

    if (total >= threshold) {
      return data[i][0];
    }
  }

  return data[data.length - 1][0];
}

export const calculatePrizeChances = (win: number, lose: number) => {
  if (win === 100) {
    return 'win';
  }
  const winState = weightedRandom([
    ['lose', lose],
    ['win', win],
  ]);

  return winState;
};

export const returnRewardDisplay = (items: any[], probabilities: number[]) => {
  const finalArray = items.map((item, index) => [item, probabilities[index]]);

  const winState = weightedRandom(finalArray);

  return winState;
};
