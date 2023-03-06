import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/main';
import Box from '@mui/material/Box';
import { NavLink } from "react-router-dom";
import Search from './Search';
import PersonIcon from '@mui/icons-material/Person';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import OpacityIcon from '@mui/icons-material/Opacity';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TerminalIcon from '@mui/icons-material/Terminal';
import ReplayIcon from '@mui/icons-material/Replay';
import Grid from '@mui/material/Grid';
import { Stack, Tooltip } from '@mui/material';

export default function Header() {

  const { workspace } = useContext(AppContext);

  const [data, setData] = useState({
    currentEpoch: 0,
    currentBlock: 0,
    txCount: 0,
  })

  const fetchData = () => {
    // TO-DO
  }

  return (
    <Box component="header">
      <Box id="menu">
        <Grid container spacing={1}>
          <Grid item xs={8} margin="auto">
            <NavLink to="accounts/">
              <PersonIcon fontSize="medium" />
              Accounts
            </NavLink>

            <NavLink to="contracts/">
              <AccountTreeIcon fontSize="medium" />
              Contracts
            </NavLink>

            <NavLink to="blocks/">
              <WidgetsOutlinedIcon fontSize="medium" />
              Blocks
            </NavLink>

            <NavLink to="txs/">
              <AssignmentOutlinedIcon fontSize="medium" />
              Transactions
            </NavLink>

            <NavLink to="logs/">
              <TerminalIcon fontSize="medium" />
              Logs
            </NavLink>

            <NavLink to="faucet/">
              <OpacityIcon fontSize="medium" />
              Faucet
            </NavLink>

            <NavLink to="wallet/">
              <AccountBalanceWalletIcon fontSize="medium" />
              Wallet
            </NavLink>
          </Grid>

          <Grid item xs={4} >
            <Search />
          </Grid>
        </Grid>
      </Box>

      <Box id="submenu">
        <Grid container spacing={1}>

          <Grid item xs={8} margin="auto" >
            <span>RPC Node: {workspace?.validator.hostname}:{workspace?.validator.rpcPort}</span>
            <span>Current epoch: {data.currentEpoch}</span>
            <span>Current blocks: {data.currentBlock}</span>
            <span>Txs total: {data.txCount}</span>
          </Grid>

          <Grid item xs={4} textAlign="center" margin={"auto"}>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
            >
              <NavLink to="start/">
                <Tooltip title="Settings Page" arrow placement="bottom" >
                  <ReplayIcon fontSize="medium" />
                </Tooltip>
              </NavLink>

              <NavLink to="settings/">
                <Tooltip title="Settings Page" arrow placement="bottom" >
                  <SettingsIcon fontSize="medium" />
                </Tooltip>
              </NavLink>
            </Stack>
          </Grid>

        </Grid>
      </Box>
    </Box>
  )

}