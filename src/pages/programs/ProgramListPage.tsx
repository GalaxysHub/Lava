import React, { useContext, useState } from "react"
import { Box, Button, Fab, Grid, IconButton, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, useTheme } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import DeployProgram from "./DeployProgram";
import { AppContext } from "../../context/main";
import { TProgram } from "../../libs/types";
import ProgramItem from "./ProgramItem";
import { NavLink } from "react-router-dom";
// import AddProject from "./AddProject";
import AddProgramFromCluster from "./AddProgramFromCluster";
import { formatBytes } from "../../utils/helper";

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
          <Tab label={`Workspace Programs (${workspace?.cluster.name})`} {...a11yProps(0)} />
          {workspace?.isLocalnet &&
            <Tab label="Program Library" {...a11yProps(0)} />
          }
        </Tabs>
      </Box>

      <Box mt='30px'>
        <TabPanel value={value} index={0}>
          {workspace?.programs && (
            <TableContainer>
              <Table size="medium">

                <TableHead>
                  <TableRow>
                    <TableCell align="center"><MoreHorizIcon fontSize="inherit" /></TableCell>
                    <TableCell align="left">INFO</TableCell>
                    <TableCell align="center">Size</TableCell>
                    <TableCell align="center">Instructions</TableCell>
                    <TableCell align="right"><MoreHorizIcon fontSize="inherit" sx={{ mx: 1.5 }} /></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Object.keys(workspace?.programs).map((key, index) => 
                    (workspace.programs[key].cluster.name === workspace.cluster.name) &&

                    <TableRow hover key={key} sx={{ height: "50px" }}>

                      <TableCell align="center" width={1}>
                        <Tooltip title="Try it!" arrow placement="top" >
                          <IconButton component={NavLink} to={`/programs/${key}`} color='primary' size="small">
                            <BugReportIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="left" className="key-item">
                        <ProgramItem index={index} program={workspace.programs[key]} />
                      </TableCell>

                      <TableCell align="center">
                      {workspace.programs[key].size ? formatBytes(workspace.programs[key].size!) : <Skeleton height={30} />}
                      </TableCell>

                      <TableCell align="center">
                        {workspace.programs[key].idl?.instructions.length
                          ?
                          workspace.programs[key].idl?.instructions.length
                          :
                          <Skeleton height={30} />
                        }
                      </TableCell>

                      <TableCell align="right">

                        <Tooltip title="Delete" arrow placement="top" >
                          <IconButton color='primary'>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                      </TableCell>

                    </TableRow>
                  )}
                </TableBody>
              </Table>

            </TableContainer>
          )}
        </TabPanel>

        {workspace?.isLocalnet &&
          <TabPanel value={value} index={1}>
            Program Library List
          </TabPanel>
        }
      </Box>

      {workspace?.isLocalnet
        ?
        <Box className="tab-button-group">
          <DeployProgram />
        </Box>
        :
        <Box className="tab-button-group">
          <AddProgramFromCluster />
        </Box>
      }

    </>
  )

}