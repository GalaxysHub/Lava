import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/main';
import Box from '@mui/material/Box';
import DnsIcon from '@mui/icons-material/Dns';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
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
          <Stack 
          direction="row"
          // justifyContent="center"
          // textAlign={"right"}
          // alignContent="right"
          spacing={2}
          >
            <Tooltip title="Workspace name" arrow placement="top" >
              <Box component={"span"}>Workspace #1</Box>
            </Tooltip>

            <Tooltip title="Worspace CPU Usage" arrow placement="top" >
              <Box component={"span"}>
                <MemoryIcon fontSize='inherit' sx={{mb:'-2px', mr:'2px'}}/>
                CPU Usage: 0%
              </Box>
            </Tooltip>
            
            <Tooltip title="Workspace Disk Usage" arrow placement="top" >
              <Box component={"span"}>
                <StorageIcon fontSize='inherit' sx={{mb:'-2px', mr:'2px'}}/>
                Disk Space Usage: 0Mb
              </Box>
            </Tooltip>

            <Tooltip title="Worspace RAM Usage" arrow placement="top" >
              <Box component={"span"}>
                <DnsIcon fontSize='inherit' sx={{mb:'-2px', mr:'2px'}}/>
                RAM Usage: 0%
              </Box>
            </Tooltip>
          </Stack>  
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
              <Box component={"span"}>App v{appVersion || '0.1.0'}</Box>
            </Tooltip>
            
            <Tooltip title="Solana CLI Tool version" arrow placement="top" >
              <Box component={"span"}>           
                Solana-cli v{testValidatorVer}
              </Box>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )

}