import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { PURCHASE_TOKEN } from '@constants/gtm';
import { Box, Typography, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useBuySpinTransactions } from 'hooks/gtm/transactions/useBuySpinTransactions';
import { useCostPerSpin } from 'hooks/gtm/useCostPerSpin';
import { useFaucetMint } from 'hooks/gtm/useFaucetMint';
import { usePricingFromOracle } from 'hooks/gtm/usePricingFromOracle';
import { useUserSpinInfo } from 'hooks/gtm/useUserSpinInfo';
import { useTokenBalance } from 'hooks/useTokenBalances';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function PurchaseSpins() {
  const theme = useTheme();
  const { pricing, isValidatingPrice, mutateTokenPrice } =
    usePricingFromOracle();

  const { costPerSpin, isValidatingCost, mutateCost } = useCostPerSpin();

  const { mutateUserData } = useUserSpinInfo();

  const { data: tokenBalance, mutate: mutateTokenBalance } = useTokenBalance(
    PURCHASE_TOKEN.address,
  );

  const [spinAmount, setSpinAmount] = useState<string>();
  const [ethAmount, setETHAmount] = useState<string>();

  const faucetMint = useFaucetMint(() => {
    mutateTokenBalance();
    mutateTokenPrice();
    mutateCost();
  });

  useEffect(() => {
    const spinamt = spinAmount ?? '0';
    if (!pricing || !costPerSpin || isNaN(parseInt(spinamt))) {
      setETHAmount('');
    } else {
      const bn = new BigNumber(isNaN(parseInt(spinamt)) ? '0' : spinamt)
        .times(costPerSpin)
        .div(pricing);
      setETHAmount(bn.gt(0) ? bn.toString() : '');
    }
  }, [spinAmount, pricing, costPerSpin]);

  const depositCallback = (err?: any) => {
    mutateTokenPrice();
    mutateCost();
    mutateUserData();
    mutateTokenBalance();
  };

  const dispatch = useBuySpinTransactions(
    PURCHASE_TOKEN,
    depositCallback,
    new BigNumber(spinAmount as string),
    new BigNumber(ethAmount as string),
  );

  return (
    <>
      <Box>
        <Typography
          variant="body-small-regular"
          color={theme.palette.neutrals[15]}
        >
          Spins
        </Typography>
        <XCaliInput
          value={spinAmount}
          setValue={setSpinAmount}
          hideBalances={true}
          token={'Spin'}
        />
      </Box>

      <Image
        style={{ margin: 'auto' }}
        alt={'swap'}
        src="/images/toggleSwap.svg"
        width={44.38}
        draggable={false}
        height={44.38}
      />

      <Box>
        <Typography
          variant="body-small-regular"
          color={theme.palette.neutrals[15]}
        >
          Amount
        </Typography>
        <XCaliInput
          value={ethAmount}
          setValue={setETHAmount}
          token={{
            ...PURCHASE_TOKEN,
            balance: new BigNumber(tokenBalance ?? '0').toString(),
          }}
          disabled={true}
        />
      </Box>

      <Box display="flex" flexDirection="row" gap="12px">
        <XCaliButton
          Component="Purchase"
          type="filled"
          variant="blue"
          showLoader={
            (!pricing && isValidatingPrice) ||
            (!costPerSpin && isValidatingCost)
          }
          onClickFn={dispatch}
          disabled={
            !pricing ||
            !costPerSpin ||
            !ethAmount ||
            !spinAmount ||
            new BigNumber(ethAmount ?? '0').gt(
              new BigNumber(tokenBalance ?? '0'),
            )
          }
        />
        <XCaliButton
          Component="Faucet"
          variant="blue"
          onClickFn={faucetMint}
          type="filled"
        />
      </Box>
    </>
  );
}
export default PurchaseSpins;
