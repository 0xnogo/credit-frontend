import { Box } from '@mui/material';
import Header from './Header';
import Info from './Info';
import ActionCard from './ActionCard';
import { CallMade } from '@mui/icons-material';
import GenesisActionCard from './ActionCard/Genesis';

export default function Stake() {
  return (
    <Box
      width="1240px"
      maxWidth={'95%'}
      margin="auto"
      marginTop="32px"
      display="flex"
      flexDirection="column"
      marginBottom="24px"
    >
      <Header
        header={'Welcome to Genesis $CREDIT staking'}
        info={`Stake Genesis $CREDIT tokens for 3 months to reduce the cliff period down to 1 month (with a 3-month linear vesting and earn a portion of the revenue & emissions, paid out in CREDIT, ETH, XCAL`}
        buyCreditComponent={
          <>
            Buy Genesis $CREDIT <CallMade />
          </>
        }
        buyCreditAction={() => {}}
      />
      <Box
        width="1200px"
        maxWidth={'95%'}
        display="flex"
        flexDirection="row-reverse"
        gap="24px"
        paddingTop="12px"
        position="relative"
        flexWrap="wrap"
      >
        <GenesisActionCard />
        <Info type={'genesis'} />
      </Box>
    </Box>
  );
}
