import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Chip, Divider, FormControl, Grid, Input, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, useTheme } from "@mui/material"
import { AccountInfo, ConfirmedSignatureInfo, Connection, LAMPORTS_PER_SOL, ParsedAccountData, ParsedAccountsModeBlockResponse, ParsedBlockResponse, ParsedMessageAccount, PublicKey, RpcResponseAndContext } from "@solana/web3.js";
import { NavLink, useParams, Link as RouterLink } from "react-router-dom";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import JsonView from "../../components/helpers/JsonView";
import { AppContext } from "../../context/main";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Terminal from "./Terminal";
import StateAccounts from "./StateAccounts";
import TestInstructionAccountItem from "./TestInstructionAccountItem";
import { Idl, Program, Provider } from "@project-serum/anchor";


interface ProgramTestTabProps {
  programPubkeyStr?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


interface Accounts {
  name: string;
  isMut: boolean;
  isSigner: boolean;
};

export default function ProgramTestTab(props: ProgramTestTabProps) {

  const { programPubkeyStr } = props;
  const { workspace } = useContext(AppContext);
  const theme = useTheme();

  const params = useParams();
  const program = params.programId;

  const idl = workspace?.programs[params.programId!].idl!;

  const [instruction, setInstruction] = React.useState(idl?.instructions[0]);
  const [accounts, setAccounts] = React.useState<Accounts[]>([]);

  const handleChangeInstruction = (event: SelectChangeEvent) => {
    if (idl?.instructions) {
      const ix = idl.instructions[Number(event.target.value)];
      setInstruction(ix);
    }
  };

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
        spacing={4}
        sx={{ height: '100%' }}
      >

        <Grid
          height={'103%'}
          item
          sm={4}
          borderRight={`1px solid ${theme.palette.divider}`} pr={3}
        >

          <Box
            // display={'flex'} 
            // sx={{ flexDirection:'column', justifyContent: 'space-between' }}
            height={'90%'}
          // sx={{ maxHeight: '90%', overflow: 'auto' }}
          >
            <Box
              mt={0.5}
            // display={'flex'} 
            // sx={{ justifyContent: 'end' }}
            >
              {/* <Box mt={1} mr={1}>Instruction to test: </Box> */}
              <Box sx={{ minWidth: '60%' }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="select-label">Instruction</InputLabel>
                  <Select
                    labelId="select-label"
                    id="ix-select"
                    value={idl.instructions.indexOf(instruction).toString()}
                    label="Instruction"
                    onChange={handleChangeInstruction}
                  >
                    {idl.instructions.map((ix, index) => (
                      <MenuItem value={index}>{ix.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Divider sx={{ my: '15px' }} />

            <Box
              pr={2.5}
              sx={{ maxHeight: '85%', overflow: 'auto' }}
            >
              {instruction?.args.map((argument, index) => (

                <Box my={1} sx={{ minWidth: '100%' }}>
                  <FormControl size="small" fullWidth>
                    {/* <InputLabel id={`argument-${index}label`}>{argument.name}</InputLabel> */}
                    <TextField
                      fullWidth
                      size="small"
                      id={`irg-input-${index}`}
                      // value={argument.name}
                      label={`${argument.name} (${argument.type.toString()})`}
                      // onChange={(event) => handleChangeArgument}
                      inputProps={{ sx: { fontSize: '0.9rem' } }}
                    />


                  </FormControl>
                </Box>
              ))}

              {/* <Divider sx={{ my: '15px' }} /> */}
              <br></br>

              {instruction?.accounts.map((account, index) => (
                <Box
                  mt={0.5}
                // display={'flex'}
                // sx={{ justifyContent: 'space-between' }}
                >
                  {/* <Box sx={{ minWidth: '60%' }}>
                    <FormControl size="small" variant="standard" fullWidth>
                      <InputLabel id={`select-label-${index}`}>{account.name}</InputLabel>
                      <Select
                        labelId={`select-label-${index}`}
                      // id="ix-select"
                      // value={instruction?.name}
                      // label="Instruction"
                      // onChange={handleChangeInstruction}
                      >

                      </Select>
                    </FormControl>
                  </Box> */}
                  <TestInstructionAccountItem
                  key={index}
                    instruction={instruction}
                    account={account}
                    index={index}
                    programID={new PublicKey(program!)}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            className="tab-button-group"
            // bgcolor={theme.palette.background.default}
            pt={1}
          // width={'100%'}
          // zIndex={1000}
          >


          </Box>
          <Button
            // className="tab-button-group"
            variant="contained"
            fullWidth>
            TEST
          </Button>

        </Grid>

        <Grid item sm={8} height={'100%'} sx={{ pl: '0px !important', pt: '15px !important' }}>
          <Grid
            container
            spacing={0}
            sx={{ height: '100%' }}
          >
            <Grid item sm={6} height={'100%'} borderRight={`1px solid ${theme.palette.divider}`}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
                  <Tab label="State Accounts" {...a11yProps(0)} />
                  <Tab label="PDA(s)" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <Box style={{ maxHeight: '100%', overflowY: 'scroll' }}>
                <TabPanel value={value} index={0}>
                  <Box minHeight={'100vh'} sx={{ overflow: 'auto' }}>
                    <StateAccounts />
                  </Box>
                </TabPanel>

                <TabPanel value={value} index={1}>
                  {workspace?.programs && program && Object.keys(workspace.programs[program].pdas).map((key, index) => (
                    <p>{key}</p>
                  ))}
                </TabPanel>
              </Box>
            </Grid>

            <Grid item sm={6} >
              <Box
              // sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Box
                  p={1}
                  color={theme.palette.primary.main}
                // sx={{ borderBottom: 2, borderColor: `${theme.palette.primary.main}` }}
                >
                  <Box className='page-header'>Program Actions</Box>
                </Box>

                <Box
                  fontSize={'0.9rem'}
                  color={theme.palette.divider}
                  display={'flex'}
                  minHeight={'40vh'}
                >

                  <Box margin={'auto'}>
                    <Box display={'block'} textAlign={'center'}>
                      <HourglassTopIcon sx={{ color: `${theme.palette.divider}` }} fontSize="large" />
                    </Box>
                    WAITING FOR INTERACTION
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* <Grid 
          item 
          sm={12} 
          bgcolor={'#252525'} 
          height={'25%'} 
          sx={{pr:'-15px !important'}}
          px={2}
          py={1}
          >
            <Box 
            height={'100%'}
            fontSize={'0.9rem'}
            >
              Logs:
            </Box>
          </Grid> */}



        </Grid>



      </Grid>

      <Terminal />

    </>
  )

}