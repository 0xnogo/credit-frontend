import Card from '@components/componentLibrary/Card';
import { Typography, useTheme } from '@mui/material';

function ParticipationInfo() {
  const theme = useTheme();
  return (
    <Card fontSize="l" header="How to Participate" sx={{ gap: '12px' }}>
      <Typography variant="body-moderate-regular" color="#F4F4F4">
        Finish the campaign on GALXE:
      </Typography>
      <Typography
        variant="body-moderate-regular"
        whiteSpace="pre-line"
        color={theme.palette.neutrals[15]}
      >
        {`1) Like & Retweet about the campaign
        2) Complete task on GALXE 
        3) This “NFT Ticket” grants you access to spin to win lootbox
        4) 1 NFT Ticket = 1 Spin
        5) $10 for 1 spin (Purchasable using ETH)
        6) All spinners will win something, items in lootbox have varied probabilities of being won (i.e less likely to win something more valuable)`}
      </Typography>
    </Card>
  );
}
export default ParticipationInfo;
