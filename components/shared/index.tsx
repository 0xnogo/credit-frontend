import { Box, LinearProgress, Typography, styled } from '@mui/material';

export const StyledBox = styled(Box)<{ width?: string; bgColor?: string }>`
  display: flex;
  width: ${({ width }) => (width ? width : '141px')};
  box-sizing: border-box;
  background: ${({ bgColor }) => (bgColor ? bgColor : '141px')};
`;

export const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 16px;
  gap: 4px;
`;

export const StyledData = styled(Typography)<{ dataSize?: string }>`
  font-family: 'Retron2000', 'sans-serif';
  font-style: normal;
  font-weight: 400;
  font-size: ${({ dataSize }) => dataSize || '24px'};
  line-height: 32px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #ffffff;
  color: #ffffff;
`;
