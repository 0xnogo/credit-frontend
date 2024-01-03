import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { useCodeRegistered } from '@functions/gtm/auction/getCodeRegistrationState';
import { useUserReferralInfo } from '@functions/gtm/auction/getUserReferralInfo';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { useClaimReferralRewardsDispatch } from 'hooks/gtm/auction/claimReferralRewards/useClaimReferralRewardsTransactions';
import { useRegisterReferralTransactionsDispatch } from 'hooks/gtm/auction/registerReferralTransactions/useRegisterReferralTransactions';
import { useEffect, useState } from 'react';

function ShareLink() {
  const theme = useTheme();

  const {
    data: { referralCode, rewardBalance },
    isLoading,
    mutate: mutateReferral,
  } = useUserReferralInfo();

  const [value, setValue] = useState<string | undefined>();

  useEffect(() => {
    if (referralCode) {
      setValue(referralCode);
    }
  }, [referralCode]);

  const {
    data: codeRegistered,
    isValidating: isCodeValidating,
    error,
    mutate,
  } = useCodeRegistered(value);

  const callback = (err?: any) => {
    if (!err) {
      mutateReferral();
      mutate();
      setValue(undefined);
    }
  };

  const dispatchRegisterReferral = useRegisterReferralTransactionsDispatch(
    value as string,
    callback,
  );

  const dispatchClaim = useClaimReferralRewardsDispatch(
    rewardBalance,
    callback,
  );

  const setReferralValue = (val: string) => {
    if (val.length <= 8) {
      setValue(val);
    }
  };

  const hasRegistered = Boolean(referralCode);

  const message = error ? (
    'An error occurred'
  ) : isCodeValidating ? (
    <LinearProgress color="info" />
  ) : hasRegistered ? (
    ''
  ) : codeRegistered ? (
    'This referral code has already been used'
  ) : (
    'This referral code is available'
  );

  const color = error
    ? 'red'
    : isCodeValidating
    ? 'white'
    : codeRegistered
    ? 'red'
    : theme.palette.brand.accent.normal;

  return (
    <Box
      display="flex"
      flexDirection="row"
      columnGap="24px"
      rowGap="12px"
      flexWrap="wrap"
      alignItems="center"
      width="600px"
      maxWidth="100%"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius="12px"
        overflow="hidden"
        width="452px"
        maxWidth="100%"
      >
        <XCaliInput
          disabled={isLoading || Boolean(referralCode)}
          orientation="left"
          placeholder="YOUR_ID_HERE"
          value={value}
          setValue={setReferralValue}
          type="text"
          flexJustify="flex-start"
          sx={{
            height: '52px',
            borderRadius: '0',
            padding: '0',
            justifyContent: 'center',
            paddingLeft: '12px',
          }}
          fontFamily="Inter"
        />
        <XCaliButton
          disabled={hasRegistered ? false : !value || codeRegistered || error}
          showLoader={isLoading || isCodeValidating}
          type="hugged"
          borderRadius="0"
          //@ts-ignore
          height="52px !important"
          //@ts-ignore
          backgroundColor="#2B2D2F !important"
          //@ts-ignore
          border="none !important"
          variant="outline"
          Component={hasRegistered ? 'Copy' : 'Register Code'}
          onClickFn={
            hasRegistered
              ? () => navigator.clipboard.writeText(value as string)
              : dispatchRegisterReferral
          }
        />
      </Box>
      <XCaliButton
        disabled={isLoading || !Boolean(referralCode) || rewardBalance.eq(0)}
        variant="blue"
        showLoader={isLoading}
        Component={'Claim'}
        onClickFn={dispatchClaim}
      />
      <Box width="452px" maxWidth="100%">
        {value && <Typography color={color}>{message}</Typography>}
      </Box>
    </Box>
  );
}

export default ShareLink;
