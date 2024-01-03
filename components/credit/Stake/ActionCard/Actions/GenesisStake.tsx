import { XCaliButton } from '@components/componentLibrary/Button/XCaliButton';
import Card from '@components/componentLibrary/Card';
import InfoCard from '@components/componentLibrary/Card/InfoCard';
import HorizontalInfo from '@components/componentLibrary/Info/HorizontalInfo';
import XCaliInput from '@components/componentLibrary/XCaliInput';
import { CREDIT_TOKEN_ADDRESS } from '@constants/contracts/addresses';
import { useEpochData } from '@functions/stake/currentEpochData';
import {
  defaultGenesisStakingObject,
  useGenesisStakingInfo,
} from '@functions/stake/genesisStakeInfo';
import { useStakingRewards } from '@functions/stake/stakingRewards';
import { Box, Typography } from '@mui/material';
import { useActiveWeb3React } from '@services/web3/useActiveWeb3React';
import { formatCurrency } from '@utils/index';
import BigNumber from 'bignumber.js';
import Modal from 'components/componentLibrary/ModalCard';
import { useStakeGenesisCallback } from 'hooks/stake/genesisTransactions/addStake/useStakeGenesisCallback';
import { useCreditToken } from 'hooks/useCreditToken';
import { useTokenBalance } from 'hooks/useTokenBalances';

type StakeActionCardProps = {
  modalOpen: boolean;
  handleCloseModal: any;
  assetOut: BigNumber;
};

function GenesisStakeCard({
  modalOpen,
  handleCloseModal,
  assetOut,
}: StakeActionCardProps) {
  const { chainId } = useActiveWeb3React();

  const { mutate } = useEpochData('global');

  const {
    data: genesisStakeInfo = defaultGenesisStakingObject,
    mutate: mutateGenesisInfo,
  } = useGenesisStakingInfo();

  const { xCreditAPR } = useStakingRewards();

  const creditToken = useCreditToken();

  const { data = new BigNumber(0), mutate: mutateTokenBalances } =
    useTokenBalance(CREDIT_TOKEN_ADDRESS[chainId]);

  const isAssetOutNaN = isNaN(Number(assetOut));

  const stakeBN = new BigNumber(isAssetOutNaN ? 0 : assetOut ?? 0);

  const stakeBNMultiplied = stakeBN.times(Math.pow(10, 18));

  const stakeEnabled = stakeBNMultiplied.gt(0) && stakeBN.lte(data);

  const stakeDispatch = useStakeGenesisCallback(
    new BigNumber(0),
    (err) => {
      if (!err) {
        mutateGenesisInfo();
        mutate();
        mutateTokenBalances();
      }
    },
    genesisStakeInfo.userRewardInfo?.proof ?? [],
  );

  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box width="480px">
        <Card header="Stake" fontSize="l" onClose={handleCloseModal}>
          <Typography variant="body-moderate-regular" color="#8D8D8D">
            Stake Genesis $CREDIT tokens for 3 months to reduce the cliff period
            down to 1 month (with a 3-month linear vesting and earn a portion of
            the revenue & emissions, paid out in CREDIT, ETH, XCAL
          </Typography>

          <XCaliInput
            token={{ ...creditToken, balance: data.toString() }}
            value={stakeBN.toString()}
            setValue={() => {}}
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
                  stakeBN
                    .div(genesisStakeInfo.genesisxCreditStaked.plus(stakeBN))
                    .times(100),
                )}%`}
              />
              <HorizontalInfo header="Lock Period" value={'3 Months'} />
              <HorizontalInfo
                header="Staking APR"
                value={formatCurrency(xCreditAPR)}
              />
              <HorizontalInfo
                header="Cliff Period"
                value={`3 Months -> 1 Month`}
              />
            </Box>
            <Box></Box>
          </InfoCard>
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

export default GenesisStakeCard;
