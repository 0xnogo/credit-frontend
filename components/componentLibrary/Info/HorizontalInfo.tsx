import { Box, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import InfoIcon from '@mui/icons-material/Info';

type HorizontalInfoProps = {
  header: ReactNode;
  value: ReactNode;
  type?: 'small' | 'medium';
  isLoading?: boolean;
  toolTipText?: ReactNode;
};

export default function HorizontalInfo({
  header,
  value,
  type = 'small',
  isLoading = false,
  toolTipText,
}: HorizontalInfoProps) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      width="100%"
    >
      <Box
        sx={{ cursor: 'pointer' }}
        display="flex"
        color={theme.palette.neutrals[15]}
        flexDirection="row"
        gap="3px"
        alignItems="center"
      >
        <Typography
          variant={
            type === 'small' ? 'body-moderate-regular' : 'body-large-medium'
          }
          color={theme.palette.neutrals[15]}
        >
          {header}
        </Typography>

        {toolTipText ? (
          <Tooltip title={toolTipText}>
            <InfoIcon sx={{ fontSize: '18px' }} />
          </Tooltip>
        ) : (
          <></>
        )}
      </Box>
      {isLoading ? (
        <Skeleton variant="rectangular" animation="wave" width="50px" />
      ) : (
        <Typography
          color={theme.palette.neutrals.white}
          variant={
            type === 'small' ? 'body-moderate-numeric' : 'body-large-numeric'
          }
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}
