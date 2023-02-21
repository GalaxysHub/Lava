import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/main';
import Box from '@mui/material/Box';
import { Link as RouterLink, NavLink } from "react-router-dom";
import Search from './Search';
import PersonIcon from '@mui/icons-material/Person';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import OpacityIcon from '@mui/icons-material/Opacity';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TerminalIcon from '@mui/icons-material/Terminal';
import GitHubIcon from '@mui/icons-material/GitHub';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import { Button, IconButton, Link, Stack, Tooltip, useTheme } from '@mui/material';
import NodeBlock from './NodeBlock';
import WorkspaceBlock from './WorkspaceBlock';

export default function Nav() {

  const theme = useTheme();

  const { settings, handleSwitchMode } = useContext(AppContext);

  const fetchData = () => {
    // TO-DO
  }

  const modeHandler = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleSwitchMode();
  }

  return (
    <Box component="header">
      <Box id="top" bgcolor={theme.palette.primary.dark}>
        <Grid container spacing={1}>

          <Grid item xs={1} margin="auto">
            <Box className="logo">
              <Link href="https://github.com/Web3-Builders-Alliance/Lava" target={"_blank"}>
                <span>Lava</span>
                <sup>beta</sup>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={3} margin="auto" display={"flex"} >
            <WorkspaceBlock />
            
            <Tooltip title="Create New Workspace" arrow placement="bottom" >
              <IconButton component={NavLink} to="/start" aria-label="workspace-new" size='small'>
                <QueuePlayNextIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={4} margin="auto" display={"flex"} className="top-left">

            <Box display={"flex"} mx={0}>
              <MoreVertIcon fontSize='small' sx={{ margin: 'auto' }} />
            </Box>

            <NodeBlock />

          </Grid>

          <Grid item xs={4} textAlign="center" margin={"auto"}>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
            >
              <Search />
            </Stack>
          </Grid>

        </Grid>
      </Box>

      <Box component="aside">

        <Box>


          <Box className="side-menu-item">
            <Link component={NavLink} to="accounts/">
              <Tooltip title="Accounts" arrow placement="right" >
                <PersonIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="programs/">
              <Tooltip title="Programs" arrow placement="right" >
                <AssignmentOutlinedIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="explorer/">
              <Tooltip title="Explorer" arrow placement="right" >
                <WidgetsOutlinedIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="logs/">
              <Tooltip title="Chain Log" arrow placement="right" >
                <TerminalIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="faucet/">
              <Tooltip title="Faucet" arrow placement="right" >
                <OpacityIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="wallet/">
              <Tooltip title="Wallet" arrow placement="right" >
                <AccountBalanceWalletIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <MoreHorizIcon fontSize="inherit" color="primary" />
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="settings/">
              <Tooltip title="App Settings" arrow placement="right" >
                <SettingsIcon fontSize="medium" />
              </Tooltip>
            </Link>
          </Box>
        </Box>

        <Box>
          <Box className="side-menu-item">
            <Link href='#' onClick={e => modeHandler(e)}>
              <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} mode`} arrow placement="right" >
                {theme.palette.mode === 'dark'
                  ?
                  <LightModeIcon fontSize="medium" />
                  :
                  <NightsStayIcon fontSize="medium" sx={{ transform: 'rotate(0deg)' }} />
                }
              </Tooltip>
            </Link>
          </Box>

          <Box className="side-menu-item">
            <Link component={NavLink} to="https://github.com/Web3-Builders-Alliance/Lava" target={"_blank"}>
              <Tooltip title="Go To Lava GitHub" arrow placement="right" >
                <GitHubIcon fontSize="medium" sx={{ fontSize: '1.4rem' }} />
              </Tooltip>
            </Link>
          </Box>
        </Box>
      </Box>


    </Box>
  )

}