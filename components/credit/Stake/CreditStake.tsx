import { Box } from '@mui/material';
import Header from './Header';
import Info from './Info';
import ActionCard from './ActionCard';
import { CallMade } from '@mui/icons-material';

export default function Stake() {
  return (
    <Box
      width="1240px"
      maxWidth={'95%'}
      margin="auto"
      marginTop="32px"
      display="flex"
      flexDirection="column"
    >
      <Header
        header={'Welcome to $CREDIT staking'}
        info={`Stake $CREDIT tokens to earn a portion of the revenue & emissions,
    paid out in CREDIT, ETH, XCAL`}
        buyCreditComponent={
          <>
            Buy $CREDIT <CallMade />
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
        <ActionCard />
        <Info type={'staking'} />
      </Box>
    </Box>
  );
}
