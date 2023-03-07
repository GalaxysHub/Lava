import React, { useContext, useState } from "react"
import { Box, Button, Grid, IconButton, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, useTheme } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeployProgram from "./DeployProgram";
import { AppContext } from "../../context/main";
import { TProgram } from "../../libs/types";
import ProgramItem from "./ProgramItem";
import { NavLink } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramListPage() {

  const { workspace } = useContext(AppContext);
  const theme = useTheme();

  // const p = workspace?.programs;
  // const [programs, setPrograms] = useState<TProgram[]>(p) 

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
          <Tab label="Workspace Programs" {...a11yProps(0)} />
          <Tab label="Program Library" {...a11yProps(0)} />
        </Tabs>
      </Box>

      <Box mt='30px'>
        <TabPanel value={value} index={0}>
          {workspace?.programs && workspace.programs.length > 0 && (
            <TableContainer>
              <Table size="medium">

                <TableHead>
                  <TableRow>
                    <TableCell align="center"><MoreHorizIcon fontSize="inherit" /></TableCell>
                    <TableCell align="left">INFO</TableCell>
                    <TableCell align="center">Size</TableCell>
                    <TableCell align="center">TXS</TableCell>
                    <TableCell align="right">Search</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {workspace?.programs?.map((item, index) => (
                    <TableRow hover key={item.account.publicKey.toString()} sx={{ height: "50px" }}>

                      <TableCell align="center" width={1}>
                        <Tooltip title="Quick Search" arrow placement="top" >
                          <IconButton component={NavLink} to={`/accounts/${item.account.publicKey.toString()}`} color='primary' size="small">
                            <RemoveRedEyeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="left" className="key-item">
                        <ProgramItem index={index} program={item} />
                      </TableCell>

                      <TableCell align="center">
                        <Skeleton height={30} />
                      </TableCell>

                      <TableCell align="center">
                        <Skeleton height={30} />
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          justifyContent="end"
                        // spacing={1}
                        >
                          <Tooltip title="Quick Search" arrow placement="top" >
                            <IconButton color='primary'>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>


                        </Stack>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          Program Library List
        </TabPanel>
      </Box>

      <Box className="tab-button-group">
        <DeployProgram />
      </Box>

    </>
  )

}