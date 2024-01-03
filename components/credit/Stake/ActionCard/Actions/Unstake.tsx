import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { useEpochData } from '@functions/stake/currentEpochData';
import { useUnstakingPenalty } from '@functions/stake/unstakingPenalty';
import { Box, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { formatCurrency } from '@utils/index';
import BigNumber from 'bignumber.js';
import Modal from 'components/componentLibrary/ModalCard';
import { useRemoveStakeTransactionDispatch } from 'hooks/stake/transactions/removeStake/useRemoveStakeTransactions';
import { useCreditToken } from 'hooks/useCreditToken';
import { useState } from 'react';

type UnstakeActionCardProps = {
  modalOpen: boolean;
  handleCloseModal: any;
};

function UnstakeCard({ modalOpen, handleCloseModal }: UnstakeActionCardProps) {
  const {
    data: currentEpochData = {
      totalAllocation: new BigNumber(0),
      userAllocation: new BigNumber(0),
    },
    mutate,
  } = useEpochData('global');

  const [assetOut, setAssetOut] = useState<string>();

  const [checked, setChecked] = useState(false);

  const creditToken = useCreditToken();

  const { data: unstakingPenalty } = useUnstakingPenalty();

  const isAssetOutNaN = isNaN(Number(assetOut));

  const stakeBN = new BigNumber(isAssetOutNaN ? 0 : assetOut ?? 0);

  const stakeBNMultiplied = stakeBN.times(Math.pow(10, 18));

  const amountAfterUnstake = stakeBN.minus(
    stakeBN.times(unstakingPenalty ?? 0),
  );

  const stakeEnabled =
    stakeBNMultiplied.gt(0) &&
    stakeBNMultiplied.lte(currentEpochData.userAllocation) &&
    checked &&
    unstakingPenalty !== undefined;

  const unstakeDispatch = useRemoveStakeTransactionDispatch(
    stakeBNMultiplied,
    amountAfterUnstake,
    unstakingPenalty ?? new BigNumber(0),
    (err) => {
      if (!err) {
        mutate();
      }
    },
    handleCloseModal,
  );

  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box width="480px">
        <Card header="Unstake" fontSize="l" onClose={handleCloseModal}>
          <XCaliInput
            token={{
              ...creditToken,
              balance: currentEpochData.userAllocation
                .div(Math.pow(10, 18))
                .toString(),
            }}
            value={assetOut}
            setValue={setAssetOut}
            title="Amount"
          />

          <InfoCard>
            <Box display="flex" flexDirection="column" width="100%" gap="12px">
              <HorizontalInfo
                header="Unstaking Penalty"
                value={formatCurrency(
                  (unstakingPenalty ?? 0)?.toString() + 'X',
                )}
              />
              <HorizontalInfo
                header="Amount to receive"
                value={`${formatCurrency(amountAfterUnstake)} CREDIT`}
              />
            </Box>
            <Box></Box>
          </InfoCard>
          <Box
            display="flex"
            flexDirection="row"
            gap="12px"
            alignItems={'start'}
          >
            <Checkbox
              checked={checked}
              onChange={(e: any) => setChecked(!checked)}
            />{' '}
            <Typography variant="body-moderate-regular" color="#8D8D8D">
              I understand that unstaking my share before the end of the epoch
              will result in a variable penalty. Unstake in week 1 = -75%
              penalty, week 2 = -50%, week 3 = 25%. Withdrawing at week 4 is
              possible with no penalties.
            </Typography>
          </Box>
          <XCaliButton
            type="filled"
            Component="unstake"
            variant="pink"
            onClickFn={unstakeDispatch}
            disabled={!stakeEnabled}
          ></XCaliButton>
        </Card>
      </Box>
    </Modal>
  );
}

export default UnstakeCard;
