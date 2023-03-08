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


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function AccountDetailsPage() {

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

  const [accountInfo, setAccountInfo] = useState<AccountInfo<Buffer | ParsedAccountData> | null>(null);
  const [accountTxs, setAccountTxs] = useState<ConfirmedSignatureInfo[]>([]);

  const fetchAccount = (account: string) => {
    if (workspace) {
      const accountPubkey = new PublicKey(account);
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getParsedAccountInfo(accountPubkey)
        .then(accountInfo => {
          setAccountInfo(accountInfo.value)
        })
    }
  }

  const fetchAccountTransactions = (account: string) => {
    if (workspace) {
      const accountPubkey = new PublicKey(account);
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getSignaturesForAddress(accountPubkey)
        .then(txs => {
          // TODO: need a limit here
          setAccountTxs(txs)
        })
    }
  }

  useEffect(() => {
    if (params.accountId) {
      fetchAccount(params.accountId);
    }

    if (params.accountId && workspace) {
      const accountPubkey = new PublicKey(params.accountId);
      const connection = new Connection(workspace.RPC, "confirmed");
      const client = connection.onAccountChange(accountPubkey, account => {
        // TODO need to fix data type?
        setAccountInfo(account);
      })


      return () => {
        connection.removeAccountChangeListener(client);
      }
    }

  }, []);

  useEffect(() => {
    if (params.accountId) {
      fetchAccountTransactions(params.accountId);
    }
  }, [accountInfo]);

  return (
    <>

      <Grid container spacing={4}>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box
              p={1}
            // sx={{ borderBottom: 2, borderColor: `${theme.palette.primary.main}` }}
            >
              <Box className='page-header'>Account Details</Box>
            </Box>
          </Box>

          <Box>

            <br></br>

            <TableContainer>

              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" colSpan={2}>
                      <Box color={theme.palette.primary.main}>OVERVIEW</Box>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  <TableRow hover>
                    <TableCell align="left">
                      Account Public Key:
                    </TableCell>

                    <TableCell align="right">

                      {accountInfo && params?.accountId
                        ?
                        <>
                          <CopyToClipboard textToCopy={params.accountId} notification='snackbar' />
                          <Box sx={{ maxWidth: '400px' }} className='long-string'>
                            {params.accountId}
                          </Box>
                        </>
                        : <Skeleton />}

                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left">
                      Owner:
                    </TableCell>

                    <TableCell align="right">
                      {accountInfo ?
                        <>
                          <CopyToClipboard textToCopy={accountInfo.owner.toString()} notification='snackbar' />
                          <Link component={NavLink} to={`/accounts/${accountInfo.owner.toString()}`}>
                            {accountInfo.owner.toString()}
                          </Link>
                        </>
                        : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left">
                      Balance:
                    </TableCell>

                    <TableCell align="right">
                      {accountInfo?.lamports ? `${accountInfo.lamports / LAMPORTS_PER_SOL} SOL` : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left" >
                      Data:
                    </TableCell>

                    <TableCell align="right">
                      {accountInfo?.data ? formatBytes((accountInfo.data as Buffer).byteLength) : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left" >
                      Executable:
                    </TableCell>

                    <TableCell align="right">
                      {accountInfo?.executable !== undefined ? <>{String(accountInfo.executable)}</> : <Skeleton />}
                    </TableCell>
                  </TableRow>


                </TableBody>
              </Table>

            </TableContainer>

            {accountInfo?.executable &&
              <Box mt={2} sx={{float:'right'}}>
                <Button component={NavLink} to={`/programs/${params.accountId}`} >
                  View Program
                </Button>
              </Box>
            }

          </Box>


        </Grid>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
              <Tab label="Transactions" {...a11yProps(0)} />
              <Tab label="JSON View" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <Box style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <TabPanel value={value} index={0}>
              {accountInfo && params.accountId &&
                <Box sx={{ wordBreak: 'break-all' }} fontSize={'0.85rem'}>

                  {accountTxs && (
                    <TableContainer>

                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">SLOT</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="right">TX SIGNATURE</TableCell>
                            <TableCell align="center">AGE</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>

                          {accountTxs.map((item) => (
                            <TableRow hover key={item.signature}>

                              <TableCell align="center">
                                {item.slot.toLocaleString()}
                              </TableCell>

                              <TableCell align="center">
                                {!item.err
                                  ?
                                  <TaskAltIcon fontSize='inherit' color="primary" sx={{ mb: -0.3 }} />
                                  :
                                  <CancelIcon fontSize='inherit' color="error" sx={{ mb: -0.3 }} />}
                              </TableCell>

                              <TableCell align="right">
                                <Box className='long-string' sx={{ maxWidth: '300px' }}>
                                  <CopyToClipboard textToCopy={item.signature} notification='snackbar' />
                                  <Link component={NavLink} to={`/txs/${item.signature}`}>
                                    {item.signature}
                                  </Link>
                                </Box>
                              </TableCell>

                              <TableCell align="center">
                                {item.blockTime
                                  ?
                                  <>
                                    {timeSince(item.blockTime)}
                                    <Tooltip title={timeConverter(item.blockTime)} arrow placement="right" >
                                      <AccessTimeIcon fontSize="inherit" color={'secondary'} sx={{ mb: '-2px', ml: '2px' }} />
                                    </Tooltip>
                                  </>
                                  :
                                  ""
                                }
                              </TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                    </TableContainer>
                  )}

                </Box>
              }
            </TabPanel>

            <TabPanel value={value} index={1}>
              {accountInfo && params.accountId &&
                <Box sx={{ wordBreak: 'break-all' }} fontSize={'0.85rem'}>
                  <JsonView data={accountInfo} name={`Account (${minimizeStr(params.accountId)})`} />
                </Box>
              }
            </TabPanel>
          </Box>

        </Grid>
      </Grid>

    </>
  )

}