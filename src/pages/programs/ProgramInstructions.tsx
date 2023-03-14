import React, { useContext } from "react"
import { Box, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tooltip, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import JsonView from "../../components/helpers/JsonView";
import { minimizeStr } from "../../utils/helper";
import { AppContext } from "../../context/main";
import { IdlAccount } from "@project-serum/anchor/dist/cjs/idl";


interface ProgramMainTabProps {
  programPubkeyStr?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramInstructions() {

  const params = useParams();
  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const idl = workspace?.programs[params.programId!].idl!;

  const [instruction, setInstruction] = React.useState(0);

  const handlerNextInstruction = () => {
    if ((instruction + 1) === idl.instructions.length) {
      setInstruction(0);
    } else (
      setInstruction(instruction + 1)
    )
  }

  const handlerPrevInstruction = () => {
    if (instruction === 0) {
      setInstruction(idl.instructions.length - 1)
    } else (
      setInstruction(instruction - 1)
    )
  }

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
          <Tab label="Instruction Details" {...a11yProps(0)} />
          <Tab label="Instructions List" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <Box style={{ maxHeight: '100%', overflow: 'auto' }}>
        <TabPanel value={value} index={0}>
          <Box>
            <Box
              mt={-2}
              mb={1}
              position={'sticky'}
              top={0}
              display={'flex'}
              justifyContent={'space-between'}
              bgcolor={theme.palette.background.default}
              zIndex={999}
            >
              <Tooltip title="Prev" arrow placement="bottom" >
                <IconButton
                  disabled={idl.instructions.length <= 1}
                  onClick={handlerPrevInstruction}
                  sx={{ ml: '10px' }}
                >
                  <ChevronLeftIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>

              <Box
                margin={'auto'}
                color={theme.palette.primary.main}
              >
                {idl.instructions[instruction].name}
              </Box>

              <Tooltip title="Next" arrow placement="bottom" >
                <IconButton
                  disabled={idl.instructions.length <= 1}
                  onClick={handlerNextInstruction}
                  sx={{ mr: '0px' }}
                >
                  <ChevronRightIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box mb={2}>
              {idl.instructions[instruction].args.map((item, index) => (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  fontSize={'0.9rem'}
                >
                  <Box mt={1.1} textTransform={'uppercase'} fontSize={'0.75rem'}>
                    <Box fontSize={'0.7rem'}>{index + 1}&nbsp;Argument</Box>
                  </Box>
                  <Box
                    mt={1}
                    px={0.5}
                    width={'100%'}
                    overflow={'hidden'}
                    color={theme.palette.secondary.main}
                  // sx={{opacity:'0.6'}}
                  >
                    ..................................................................................................................
                  </Box>
                  <Box display={'flex'} mt={0.7} ml={0.5}>
                    <Box color={theme.palette.secondary.dark} mr={0.3}>{item.type.toString()}</Box>
                    <Box color={theme.palette.primary.main}>{item.name}</Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box>
              {idl.instructions[instruction].accounts.map((item, index) => (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  fontSize={'0.95rem'}
                  // minHeight={40}
                  mb={1}
                >
                  <Box display={'table-cell'} margin={'auto 0'}>
                    <PersonIcon color="primary" fontSize="inherit" sx={{ verticalAlign: 'bottom' }} />
                  </Box>
                  <Box
                    mt={1}
                    px={0.5}
                    width={'100%'}
                    overflow={'hidden'}
                    color={theme.palette.primary.dark}
                    sx={{ opacity: '0.6' }}
                  >
                    ..................................................................................................................
                  </Box>
                  <Box pl={0.5} margin={'auto 0'} textAlign={'right'}>
                    <Box
                      display={'flex'}
                      mb={-0.7}
                      fontSize={'0.6rem'}
                      textTransform={'uppercase'}
                      justifyContent={'end'}
                    >
                      <Box color={theme.palette.secondary.dark} mr={0.5}>{(item as IdlAccount).isMut ? 'writable' : <>&nbsp;</>}</Box>
                      <Box>{(item as IdlAccount).isSigner && 'signer'}</Box>
                    </Box>
                    <Box color={theme.palette.primary.main}>
                      {item.name}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{ overflow: 'auto', wordBreak: 'break-all' }} fontSize={'0.9rem'}>
            <Box
            my={1}
            fontSize={'0.8rem'}
            textTransform={'uppercase'}
            color={theme.palette.primary.main}
            margin={'right'}
            sx={{float:'right'}}
            >
              All Program Instructions
            </Box>
            <Table size="small" className="table-striped-with-head">
              <TableHead>
                <TableRow hover>
                  <TableCell color={theme.palette.primary.main}>
                    Instruction
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Arguments" arrow >
                      <CodeIcon fontSize="inherit" color="primary" />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Accounts" arrow >
                      <PersonIcon fontSize="inherit" color="primary" />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {idl.instructions.map((item, index) => (
                  <TableRow hover>
                    <TableCell>
                      {item.name}
                    </TableCell>
                    <TableCell align="center">
                      {item.args.length ? item.args.length : ''}
                    </TableCell>
                    <TableCell align="center">
                      {item.accounts.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TabPanel>
      </Box>
    </>
  )

}