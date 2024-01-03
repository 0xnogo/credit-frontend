import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

export default function Faq() {
  const theme = useTheme();

  const StyledSummaryTypography = styled(Box)`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    padding: 6px 0px;
  `;

  const DetailsContainer = styled(Typography)`
    max-width: 680px;
    padding: 12px 0px 24px;
  `;

  const StyledHeadingTypography = styled(Box)`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;
    color: #f4f4f4;
    margin-bottom: 18px;
  `;

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <StyledHeadingTypography>
        Frequently asked questions
      </StyledHeadingTypography>
      <Accordion
        sx={{
          backgroundImage: 'none',
          '&.Mui-expanded': {
            margin: '0', // Remove the margin when accordion is expanded
            '&:before': {
              opacity: 1,
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            '&.Mui-expanded': {
              margin: '0 !important',
            },
          }}
        >
          <StyledSummaryTypography>
            $CREDIT tokenomics explained
          </StyledSummaryTypography>
        </AccordionSummary>
        <AccordionDetails>
          <DetailsContainer>
            <Typography
              variant="body-moderate-medium"
              color={theme.palette.neutrals[15]}
            >
              100,000 $CREDITS (10% of max supply TGE)
              <br />
              <br />
              5% (50,000): 3 month cliff then 3 month vest (staked and receiving
              fees normally, emissions accumulate and release after cliff)
              <br />
              <br />
              Token recipients can chose to stake their launch share in order to
              reduce the cliff to 1 month.
              <br />
              Unsold tokens will be sent back to treasury
            </Typography>
          </DetailsContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundImage: 'none',
          '&.Mui-expanded': {
            margin: 0, // Remove the margin when accordion is expanded
            '&:before': {
              opacity: 1,
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <StyledSummaryTypography>
            How is price determined?
          </StyledSummaryTypography>
        </AccordionSummary>
        <AccordionDetails>
          <DetailsContainer>
            <Typography
              variant="body-moderate-medium"
              color={theme.palette.neutrals[15]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </DetailsContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundImage: 'none',
          '&.Mui-expanded': {
            margin: 0, // Remove the margin when accordion is expanded
            '&:before': {
              opacity: 1,
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <StyledSummaryTypography>Claiming process</StyledSummaryTypography>
        </AccordionSummary>
        <AccordionDetails>
          <DetailsContainer>
            <Typography
              variant="body-moderate-medium"
              color={theme.palette.neutrals[15]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </DetailsContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundImage: 'none',
          '&.Mui-expanded': {
            margin: 0, // Remove the margin when accordion is expanded
            '&:before': {
              opacity: 1,
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <StyledSummaryTypography>Bonuses</StyledSummaryTypography>
        </AccordionSummary>
        <AccordionDetails>
          <DetailsContainer>
            <Typography
              variant="body-moderate-medium"
              color={theme.palette.neutrals[15]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </DetailsContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
