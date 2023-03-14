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
import BugReportIcon from '@mui/icons-material/BugReport';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Grid from '@mui/material/Grid';
import { Button, IconButton, Link, Stack, Tooltip, useTheme } from '@mui/material';
import NodeBlock from './NodeBlock';
import WorkspaceBlock from './WorkspaceBlock';
import Wallet from './Wallet';
import ClusterSelect from './ClusterSelect';

export default function Nav() {

  const theme = useTheme();

  const { workspace, handleSwitchMode } = useContext(AppContext);

  const fetchData = () => {
    // TO-DO
  }

  const modeHandler = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleSwitchMode();
  }

  return (
    <>
      <Box component="header">
        <Box id="top" bgcolor={theme.palette.primary.dark}>
          <Grid container spacing={1}>

            <Grid item xs={1} margin="auto">
              <Box className="logo">
                <span>Lava</span>
                <sup>beta</sup>
              </Box>
            </Grid>

            <Grid item xs={7} margin="auto" display={'flex'} justifyContent={'space-between'}>
              <Box display={'flex'} >
                <WorkspaceBlock />

                <Box display={"flex"} mx={2}>
                  <MoreVertIcon fontSize='inherit' sx={{ margin: 'auto' }} />
                </Box>

                {/* <Tooltip title="Create New Workspace" arrow placement="bottom" >
                <IconButton component={NavLink} to="/start" aria-label="workspace-new" size='small'>
                  <QueuePlayNextIcon fontSize='small' />
                </IconButton>
              </Tooltip> */}

                <Button
                  color="secondary"
                  startIcon={<ControlPointIcon />}
                  component={NavLink}
                  to="/start"
                  aria-label="workspace-new"
                >
                  New
                </Button>

                {/* <Tooltip title="Exit" arrow placement="bottom" >
                <IconButton aria-label="exit" size='small' sx={{ ml: '10px' }}>
                  <LogoutIcon fontSize='small' />
                </IconButton>
              </Tooltip> */}
              </Box>

              <Box display={'flex'} mr={1}>

                <Box display={"flex"} mx={1}>
                  <MoreVertIcon fontSize='inherit' sx={{ margin: 'auto' }} />
                </Box>

                <NodeBlock />

                <Box display={"flex"} mx={1}>
                  <MoreVertIcon fontSize='inherit' sx={{ margin: 'auto' }} />
                </Box>

                <ClusterSelect />

              </Box>
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
              <Tooltip title="Accounts" arrow placement="right" >
                <IconButton component={NavLink} to="accounts/" color='primary'>
                  <PersonIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Programs" arrow placement="right" >
                <IconButton component={NavLink} to="programs/" color='primary'>
                  <BugReportIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Explorer" arrow placement="right" >
                <IconButton component={NavLink} to="explorer/" color='primary'>
                  <WidgetsOutlinedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Chain Log" arrow placement="right" >
                <IconButton component={NavLink} to="logs/" color='primary'>
                  <TerminalIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Wallet" arrow placement="right" >
                <Wallet />
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <MoreHorizIcon fontSize="inherit" color="primary" />
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="App Settings" arrow placement="right" >
                <IconButton component={NavLink} to="settings/" color='primary'>
                  <SettingsIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box>
            <Box className="side-menu-item">
              <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} mode`} arrow placement="right" >
                <IconButton href='#' onClick={e => modeHandler(e)} color='primary'>
                  {theme.palette.mode === 'dark'
                    ?
                    <LightModeIcon fontSize="medium" />
                    :
                    <NightsStayIcon fontSize="medium" sx={{ transform: 'rotate(0deg)' }} />
                  }
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Lava Docs" arrow placement="right" >
                <IconButton color='primary'>
                  <MenuBookIcon fontSize="medium" sx={{ fontSize: '1.4rem' }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box className="side-menu-item">
              <Tooltip title="Lava GitHub" arrow placement="right" >
                <IconButton color='primary'>
                  <GitHubIcon fontSize="medium" sx={{ fontSize: '1.4rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>


      </Box>
    </>
  )

}