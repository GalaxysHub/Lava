import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/main';
import Box from '@mui/material/Box';
import DnsIcon from '@mui/icons-material/Dns';
import { NavLink } from "react-router-dom";

import Grid from '@mui/material/Grid';
import { Stack, Tooltip, useTheme } from '@mui/material';

export default function Footer() {

  const theme = useTheme();
  const {appVersion} = useContext(AppContext)

  // TO-DO
  const testValidatorVer = "1.15.0"

  const [data, setData] = useState({
    
  })

  const fetchData = () => {
    // TO-DO
  }

  return (
    <Box 
    component={"footer"} 
    color={theme.palette.secondary.main}
    // bgcolor={theme.palette.secondary.main}
    >
      <Grid container spacing={1}>
        <Grid item xs={6} margin="auto">
          
        </Grid>

        <Grid item xs={6} >
          <Stack 
          direction="row"
          justifyContent="center"
          // textAlign={"right"}
          // alignContent="right"
          spacing={2}
          >
            <Tooltip title="Lava suite version" arrow placement="top" >
              <Box component={"span"}>App v{appVersion}</Box>
            </Tooltip>
            
            <Tooltip title="Solana test-validator cli" arrow placement="top" >
              <Box component={"span"}>
                <DnsIcon fontSize='inherit' sx={{mb:'-2px', mr:'2px'}}/>
                Test-validator v{testValidatorVer}
              </Box>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )

}