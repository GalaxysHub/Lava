import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Chip, Grid, Link, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, useTheme } from "@mui/material"
import { AccountInfo, ConfirmedSignatureInfo, Connection, LAMPORTS_PER_SOL, ParsedAccountData, ParsedAccountsModeBlockResponse, ParsedBlockResponse, ParsedMessageAccount, PublicKey, RpcResponseAndContext } from "@solana/web3.js";
import { NavLink, useParams, Link as RouterLink } from "react-router-dom";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import JsonView from "../../components/helpers/JsonView";
import { AppContext } from "../../context/main";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatBytes, minimizeStr, timeConverter, timeSince } from "../../utils/helper";
import ProgramTestTab from "./ProgramTestTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramDetailsPage() {

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
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        className='tabs-panel'
        bgcolor={theme.palette.background.default}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Program Overview" {...a11yProps(0)} />
          <Tab label="Testing" {...a11yProps(1)} />
          <Tab label="TAB 3" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <Box mt='30px'>
        <TabPanel value={value} index={0}>
          Program Owerview
          {params.programId}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ProgramTestTab programPubkeyStr={params.programId}/>
        </TabPanel>

        <TabPanel value={value} index={2}>
          Tab 3
        </TabPanel>
      </Box>


      <Box className="tab-button-group">

      </Box>


    </>
  )

}