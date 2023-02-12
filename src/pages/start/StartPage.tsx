import React, { useContext } from "react"

import { Box, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();
  const {collectAccounts} = useContext(AppContext);

  const startHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    collectAccounts(10);
    navigate('/accounts/');
  }

  const theme = useTheme();

  return (
    <Box id="start-page" bgcolor={theme.palette.primary.light} textAlign={"center"} display="flex" height={"100vh"}>
      <Box margin={"auto"}>
        <h1>LAVA</h1>
        <Button onClick={startHandle} variant="contained">QUICK START</Button>
      </Box>
    </Box>
  )

}