import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import { useRouter } from "next/router";

export function Points() {
  const router = useRouter();

  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.neutrals[60],
        padding: "10px",
        paddingY: "5px",
        cursor: "pointer",
        borderRadius: "5px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
      onClick={() => router.push("/points")}
    >
      <ScoreboardIcon sx={{ color: "white", fontSize: "20px" }} />
      <Typography color="white" variant="body-moderate-numeric">
        5000
      </Typography>
    </Box>
  );
}
