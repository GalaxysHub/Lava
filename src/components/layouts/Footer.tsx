import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/main';
import Box from '@mui/material/Box';
import DnsIcon from '@mui/icons-material/Dns';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import BugReportIcon from '@mui/icons-material/BugReport';
import { NavLink } from "react-router-dom";

import Grid from '@mui/material/Grid';
import { Stack, Tooltip, useTheme } from '@mui/material';

export default function Footer() {

  const theme = useTheme();
  const { workspace, appVersion } = useContext(AppContext)

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
      color={theme.palette.secondary.dark}
    // bgcolor={theme.palette.secondary.main}
    textTransform={'uppercase'}
    fontSize={'0.75rem'}
    >
      <Grid container spacing={1}>
        <Grid item xs={6} margin="auto" >
          <Stack
            direction="row"
            ml={2}
            // textAlign={"right"}
            // alignContent="right"
            spacing={4}
          >
            <Tooltip title="Workspace name" arrow placement="top" >
              <Box component={"span"}>Workspace #1</Box>
            </Tooltip>

            <Tooltip title="Worspace CPU Usage" arrow placement="top" >
              <Box component={"span"}>
                <MemoryIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                CPU Usage: 23%
              </Box>
            </Tooltip>

            <Tooltip title="Workspace Disk Usage" arrow placement="top" >
              <Box component={"span"}>
                <StorageIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                Disk Space Usage: 72Mb
              </Box>
            </Tooltip>

            <Tooltip title="Worspace RAM Usage" arrow placement="top" >
              <Box component={"span"}>
                <DnsIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                RAM Usage: 14%
              </Box>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid item xs={6} >
          <Stack
            direction="row"
            justifyContent="right"
            mr={3}
            // textAlign={"right"}
            // alignContent="right"
            spacing={4}
          >
            <Tooltip title="Current cluster">
              <Box component={"span"}>
                <RssFeedIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                {workspace?.cluster.name}
              </Box>
            </Tooltip>
            <Tooltip title="Lava suite version" arrow placement="top" >
              <Box component={"span"}>
                <BugReportIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                App v{appVersion || '0.1.0'}
              </Box>
            </Tooltip>

            <Tooltip title="Solana CLI Tool version" arrow placement="top" >
              <Box component={"span"}>
                <RadioButtonCheckedIcon fontSize='inherit' sx={{ mb: '-2px', mr: '2px' }} />
                Solana-cli v{testValidatorVer}
              </Box>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )

}