import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Chip, Divider, FormControl, Grid, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, useTheme } from "@mui/material"
import { AccountInfo, ConfirmedSignatureInfo, Connection, LAMPORTS_PER_SOL, ParsedAccountData, ParsedAccountsModeBlockResponse, ParsedBlockResponse, ParsedMessageAccount, PublicKey, RpcResponseAndContext } from "@solana/web3.js";
import { NavLink, useParams, Link as RouterLink } from "react-router-dom";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import JsonView from "../../components/helpers/JsonView";
import { AppContext } from "../../context/main";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatBytes, minimizeStr, timeConverter, timeSince } from "../../utils/helper";
import { BN, Program } from '@project-serum/anchor';
import Terminal from "./Terminal";
import StateAccounts from "./StateAccounts";
import ProgramOverview from "./ProgramOverview";
import ProgramInstructions from "./ProgramInstructions";
import ProgramTransactions from "./ProgramTransactions";


interface ProgramMainTabProps {
  programPubkeyStr: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramMainTab(props: ProgramMainTabProps) {

  const { programPubkeyStr } = props;

  const params = useParams();
  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };



  return (
    <>

      <Grid
        container
        spacing={2}
        sx={{ height: '100%' }}
      >

        <Grid
          height={'100%'}
          item
          sm={4}
          borderRight={`1px solid ${theme.palette.divider}`} pr={3}
        >
          <ProgramOverview programPubkeyStr={params.programId!}/>
        </Grid>

        <Grid
          item
          sm={8}
          height={'100%'}
          sx={{ pl: '0px !important', pt: '15px !important' }}
        >
          <Grid
            container
            spacing={1}
            sx={{ height: '65%' }}
          >
            <Grid
              item
              sm={6}
              height={'100%'}
            // sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Box maxHeight={'50vh'} sx={{ overflow: 'auto' }}>
                <ProgramInstructions />
              </Box>
            </Grid>

            <Grid item sm={6} height={'100%'}>
              <Box maxHeight={'50vh'} sx={{ overflow: 'auto' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={2}>
                  <Box p={1}
                  // sx={{ borderBottom: 2, borderColor: `${theme.palette.primary.main}` }}
                  >
                    <Box className='page-header' color={theme.palette.primary.main}>
                      Account's State Representation
                    </Box>
                  </Box>
                </Box>
                <StateAccounts skipData />
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={0}
            sx={{ height: '35%' }}
          >
            <Grid item sm={12} maxHeight={'100%'} sx={{ borderTop: 1, borderColor: 'divider' }}>
              <Box p={1}>
                <Box className='page-header' color={theme.palette.primary.main}>
                  Program Transactions
                </Box>
              </Box>

              <Box >
                <ProgramTransactions programPubkeyStr={programPubkeyStr}/>
              </Box>
            </Grid>
          </Grid>

        </Grid>
      </Grid>


    </>
  )

}