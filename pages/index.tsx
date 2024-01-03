import { XCaliButton } from "@components/componentLibrary/Button/XCaliButton";
import { Box, Link, Typography, useTheme } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Landing() {
  const theme = useTheme();

  return (
    <Box
      width="100vw"
      height="calc(100vh - 79px)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      gap="10px"
    >
      <Typography sx={{ color: "white" }} variant="title-moderate-numeric">
        Coming Soon
      </Typography>
      <Typography
        sx={{ color: theme.palette.neutrals[15] }}
        variant="body-large-regular"
      >
        Check out our twitter to get updates on our product
      </Typography>
      <Link target="_blank" href="https://twitter.com/creditprotocol">
        <Box width="250px">
          <XCaliButton
            type="filled"
            variant="neutral"
            Component={<TwitterIcon />}
          />
        </Box>
      </Link>
    </Box>
  );
}
