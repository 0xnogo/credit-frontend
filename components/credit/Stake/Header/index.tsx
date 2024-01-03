import ToggleButton from '@components/componentLibrary/ToggleButton';
import { AnimatedCreditLogo } from '@components/icons/svgs/CreditLogo';
import { StyledData } from '@components/shared';
import { ToggleButtonData, stakeRoutes } from '@constants/routes';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

interface HeaderProps {
  header: string;
  info: string;
  buyCreditComponent: ReactNode;
  buyCreditAction: any;
}

export default function Header({
  header,
  info,
  buyCreditComponent,
  buyCreditAction,
}: HeaderProps) {
  const router = useRouter();

  const path = router.pathname;

  const value = stakeRoutes.find((val) => val.route === path) ?? stakeRoutes[0];

  const setRoute = (data: ToggleButtonData) => {
    if (data.value !== value?.value) {
      router.push(data.route);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexWrap="wrap"
      position="relative"
    >
      <Box display="flex" flexDirection="column" rowGap="24px">
        <Box width="450px">
          <ToggleButton
            value={value}
            setValue={setRoute}
            renderedOption={(value, isSelected) => (
              <Typography
                variant="body-moderate-regular"
                textTransform={'initial'}
                sx={{
                  color: isSelected ? 'white' : '#8D8D8D',
                }}
              >
                {value.display}
              </Typography>
            )}
            values={stakeRoutes}
            isSelected={(value, data) => value.value === data.value}
          />
        </Box>

        <Typography
          color="white"
          sx={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '24px',
          }}
        >
          {header}
        </Typography>
        <Typography
          variant="body-moderate-regular"
          color="#8D8D8D"
          width="700px"
          maxWidth="100%"
        >
          {info}
        </Typography>
        <StyledData
          display="flex"
          flexDirection="row"
          gap="12px"
          alignItems={'center'}
          width={'max-content'}
          fontSize={'14px !important'}
          lineHeight={'initial !important'}
          sx={{ borderBottom: 'none !important', cursor: 'pointer' }}
          onClick={buyCreditAction}
        >
          {buyCreditComponent}
        </StyledData>
      </Box>
      <Box
        sx={{
          scale: '1.2',
          position: 'absolute',
          top: '-30px',
          right: '0',
          zIndex: '-1',
        }}
      >
        <AnimatedCreditLogo />
      </Box>
    </Box>
  );
}
