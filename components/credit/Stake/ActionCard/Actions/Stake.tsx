import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { useEpochData } from '@functions/stake/currentEpochData';
import { useStakingRewards } from '@functions/stake/stakingRewards';
import { Box, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { formatCurrency } from '@utils/index';
import BigNumber from 'bignumber.js';
import Modal from 'components/componentLibrary/ModalCard';
import { useStakeTransactionsDispatch } from 'hooks/stake/transactions/addStake/useStakeTransactions';
import { useCreditToken } from 'hooks/useCreditToken';
import { useTokenBalance } from 'hooks/useTokenBalances';
import { useTokenMapping } from 'hooks/useTokenMapping';
import { useState } from 'react';

type StakeActionCardProps = {
  modalOpen: boolean;
  handleCloseModal: any;
};

function StakeCard({ modalOpen, handleCloseModal }: StakeActionCardProps) {
  const { chainId } = useActiveWeb3React();

  const {
    data: currentEpochData = {
      totalAllocation: new BigNumber(0),
    },
    mutate,
  } = useEpochData('global');

  const { xCreditAPR } = useStakingRewards();

  const [assetOut, setAssetOut] = useState<string>();

  const [checked, setChecked] = useState(false);

  const { data: tokenMapping = {} } = useTokenMapping();

  const creditToken = tokenMapping[CREDIT_TOKEN_ADDRESS[chainId]];

  const { data = new BigNumber(0), mutate: mutateTokenBalances } =
    useTokenBalance(CREDIT_TOKEN_ADDRESS[chainId]);

  const isAssetOutNaN = isNaN(Number(assetOut));

  const stakeBN = new BigNumber(isAssetOutNaN ? 0 : assetOut ?? 0);

  const stakeBNMultiplied = stakeBN.times(Math.pow(10, 18));

  const stakeEnabled = stakeBNMultiplied.gt(0) && stakeBN.lte(data) && checked;

  const stakeDispatch = useStakeTransactionsDispatch(
    stakeBNMultiplied,
    (err) => {
      if (!err) {
        mutateTokenBalances();
        mutate();
      }
    },
    handleCloseModal,
  );

  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box width="480px">
        <Card header="Stake" fontSize="l" onClose={handleCloseModal}>
          <Typography variant="body-moderate-regular" color="#8D8D8D">
            Stake $CREDIT tokens to earn a portion of the protocol revenue, paid
            out in CREDIT, ETH, XCAL
          </Typography>

          <XCaliInput
            token={{ ...creditToken, balance: data.toString() }}
            value={assetOut}
            setValue={setAssetOut}
            title="Amount"
          />

          <InfoCard>
            <Box display="flex" flexDirection="column" width="100%" gap="12px">
              <HorizontalInfo
                header="Total allocation amount"
                value={formatCurrency(stakeBN)}
              />
              <HorizontalInfo
                header="Your share"
                value={`${formatCurrency(
                  stakeBNMultiplied
                    .div(
                      currentEpochData.totalAllocation.plus(stakeBNMultiplied),
                    )
                    .times(100),
                )}%`}
              />
              <HorizontalInfo
                header="Staking APR"
                value={formatCurrency(xCreditAPR)}
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
            Component="stake"
            variant="blue"
            onClickFn={stakeDispatch}
            disabled={!stakeEnabled}
          ></XCaliButton>
        </Card>
      </Box>
    </Modal>
  );
}

export default StakeCard;
