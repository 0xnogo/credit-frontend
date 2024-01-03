import { Box, styled } from '@mui/material';

const InfoCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.palette.neutrals[40]};
  border-radius: 12px;
  width: calc(100% - 32px);
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px 12px 16px;
  color: white;
`;

export default InfoCard;
