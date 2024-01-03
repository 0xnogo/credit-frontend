import { Box } from '@mui/material';
import SpinInfo from './SpinInfo';
import ToggleModal from './ToggleModal';
import ParticipationInfo from './ParticipationInfo';

function PurchaseSection({ properties }: { properties: any }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        paddingBottom: '12px',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        style={properties}
        gap="24px"
      >
        <SpinInfo />
        <ToggleModal />
        <ParticipationInfo />
      </Box>
    </Box>
  );
}
export default PurchaseSection;
