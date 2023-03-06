import React, { useContext, useEffect, useState } from "react"
import { Box, Chip, Grid, Link, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, useTheme } from "@mui/material"
import { Connection, LAMPORTS_PER_SOL, ParsedAccountsModeBlockResponse, ParsedBlockResponse, ParsedMessageAccount } from "@solana/web3.js";
import { NavLink, useParams } from "react-router-dom";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import JsonView from "../../components/helpers/JsonView";
import { AppContext } from "../../context/main";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { minimizeStr, timeConverter, timeSince } from "../../utils/helper";


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

      <Grid container spacing={4}>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box
              p={1}
            // sx={{ borderBottom: 2, borderColor: `${theme.palette.primary.main}` }}
            >
              <Box className='page-header'>Program Details</Box>
            </Box>
          </Box>

          <Box>
            {params.programId}
          </Box>


        </Grid>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
              <Tab label="Tab 1" {...a11yProps(0)} />
              <Tab label="JSON View" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <Box style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <TabPanel value={value} index={0}>
   
            </TabPanel>

            <TabPanel value={value} index={1}>
              
            </TabPanel>
          </Box>

        </Grid>
      </Grid>

    </>
  )

}