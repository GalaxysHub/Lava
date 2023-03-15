import React, { useContext, useEffect, useState } from "react";
import { ConfirmedSignatureInfo, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyIcon from '@mui/icons-material/Key';
import CloseIcon from '@mui/icons-material/Close';
import KeyItem from "./KeyItem";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OpacityIcon from '@mui/icons-material/Opacity';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { QRCodeSVG } from 'qrcode.react';
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Skeleton, Stack, Tab, Tabs, Tooltip, useTheme } from "@mui/material";
import { minimizeStr } from "../../utils/helper";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";


export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


export default function AccountListPage() {

  const theme = useTheme();

  const { workspace, setWorkspace, setQuickSearch } = useContext(AppContext);

  const [secret, setSecret] = useState<[string, string, string]>()
  const [qrcode, setQrcode] = useState<[string, string]>()

  const showPrivateData = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    // console.log(value.secretKey)
    const secret = workspace?.accounts![value].keypair.secretKey.toString()!;
    const mnemonic = workspace?.accounts![value].mnemonic!;
    if (secret && mnemonic) {
      setSecret([workspace?.accounts![value].keypair.publicKey.toString()!, secret, mnemonic]);
    }
    setDialogOpen(true);
  }

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setQrcode(undefined);
    setSecret(undefined);
  };

  const handleQRClick = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    // console.log(value.publicKey)
    setQrcode([workspace?.accounts![value].keypair.publicKey.toString()!, value]);
    setDialogOpen(true);
  };

  const swapToWallet = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    console.log(value)
  }

  const addFunds = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    console.log(value)
  }

  const quickSearch = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    setQuickSearch(value)
  }

  const saveJsonFile = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    console.log(value)
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  // const [balances, setBalances] = useState<Record<string, number>>({});

  const [balances, setBalances] = useState<number[]>([]);
  const [transactions, setTransactions] = useState<number[]>([]);

  // const updateAccounts = () => {
  //   if (workspace?.accounts) {

  //     const connection = new Connection(workspace.RPC, "confirmed");


  //     Object.keys(workspace.accounts).forEach(key => {
  //       connection.getBalance(workspace.accounts![key].keypair.publicKey)
  //         .then(balance => {
  //           // console.log(workspace.accounts![key].keypair.publicKey, balance)
  //           // let newBalances: Record<string, number> = { ...balances };
  //           // newBalances[key] = balance;
  //           // console.log(newBalances)
  //           // setBalances(newBalances);
  //           setBalances(oldBalances => {
  //             oldBalances[key] = balance;
  //             console.log('old:', oldBalances)
  //             return oldBalances;
  //           })
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         })
  //     })

  //   }
  // }


  const updateAccount = (accountIndex: number) => {
    if (workspace?.accounts) {

      const connection = new Connection(workspace.RPC, "confirmed");

      connection.getBalance(workspace.accountsAsArray[accountIndex].keypair.publicKey)
        .then(balance => {
          let newBalances = [...balances];
          newBalances[accountIndex] = balance;
          setBalances(newBalances);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const updateAccounts = () => {
    if (workspace?.accounts) {

      const connection = new Connection(workspace.RPC, "confirmed");

      const balancePromises: Promise<number>[] = [];

      for (let i = 0; i < workspace.accountsAsArray.length; i++) {
        const balance = connection.getBalance(workspace.accountsAsArray[i].keypair.publicKey);
        balancePromises.push(balance);
      }

      Promise.all(balancePromises)
        .then(responses => {
          setBalances(responses);
        })
        .catch((error) => {
          console.log(error);
        })


      // const txsPromises: Promise<ConfirmedSignatureInfo[]>[] = [];

      // for (let i = 0; i < workspace.accountsAsArray.length; i++) {
      //   const txRequest = connection.getSignaturesForAddress(workspace.accountsAsArray[i].keypair.publicKey);
      //   txsPromises.push(txRequest);
      // }

      // Promise.all(txsPromises)
      //   .then(responses => {
      //     // setTransactions(responses);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   })
    }
  }

  useEffect(() => {
    // console.log('balances: ', balances);


    const accounts = workspace?.accountsAsArray;

    let clients: number[] = [];

    if (accounts && accounts?.length! > 0 && workspace?.RPC !== undefined) {

      const connection = new Connection(workspace.RPC, "confirmed");

      for (let i = 0; i < accounts?.length; i++) {
        clients.push(
          connection.onAccountChange(accounts[i].keypair.publicKey, account => {
            let newBalances = [...balances];
            newBalances[i] = account.lamports;
            setBalances(newBalances);
          }))
      }

      return () => {
        for (let i = 0; i < clients?.length; i++) {
          connection.removeAccountChangeListener(clients[i]);
        }
      }
    }

  }, []);

  useEffect(() => {
    if (balances.length === 0) {
      updateAccounts();
    }
  }, []);

  useEffect(() => {
    console.log('balances: ', balances);
  }, [balances]);

  return (
    <>

      <Box
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        className='tabs-panel'
        bgcolor={theme.palette.background.default}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Workspace Active Accounts" {...a11yProps(0)} />
          <Tab label="Closed Accounts" {...a11yProps(0)} />
        </Tabs>
      </Box>

      <Box mt='23px'>
        <TabPanel value={value} index={0}>
          {workspace?.accounts && (
            <TableContainer>
              <Table size="medium">
                <TableBody>
                  {Object.keys(workspace.accounts).map((key, index) => (
                    <TableRow hover key={key} sx={{ height: "50px" }}>
                      <TableCell align="center" width={1}>
                        {/* {index + 1} */}
                        <FiberManualRecordIcon fontSize="inherit" color="primary" />
                      </TableCell>

                      <TableCell align="left" className="key-item">
                        <KeyItem index={index} pubkeyStr={key} />
                      </TableCell>

                      <TableCell align="right">
                        {/* {balances[key] ? `${balances[key] / LAMPORTS_PER_SOL} SOL` : <Skeleton height={30} />} */}
                        <Box minWidth={'50px'}>
                          {balances[index] ? `${(balances[index] / LAMPORTS_PER_SOL).toFixed(4)} SOL` : <Skeleton height={30} />}
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Skeleton height={30} />
                      </TableCell>

                      <TableCell align="center">
                        <Skeleton height={30} />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          justifyContent="end"
                        // spacing={1}
                        >
                          <Tooltip title="Quick Search" arrow placement="top" >
                            <IconButton onClick={(event) => quickSearch(event, key)} color='primary'>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Add funds" arrow placement="top" >
                            <IconButton onClick={(event) => addFunds(event, key)} color='primary' >
                              <OpacityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Swap to Wallet" arrow placement="top" >
                            <IconButton onClick={(event) => swapToWallet(event, key)} color='primary'>
                              <AccountBalanceWalletIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Show QR" arrow placement="top" >
                            <IconButton onClick={(event) => handleQRClick(event, key)} color='primary'>
                              <QrCodeIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Show Private key" arrow placement="top" >
                            <IconButton onClick={(event) => showPrivateData(event, key)} color='primary'>
                              <KeyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Save JSON file" arrow placement="top" >
                            <IconButton onClick={(event) => saveJsonFile(event, key)} color='primary'>
                              <FileDownloadIcon fontSize="small" />
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

        </TabPanel>
      </Box>


      <Dialog
        // fullWidth
        maxWidth='sm'
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            size='small'
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent >
          {qrcode &&
            <>
              <Box>
                <Box
                  my={2}
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Box
                    textTransform={'uppercase'}
                    fontSize={'0.9rem'}
                  >
                    Account:
                  </Box>
                  <Box
                    color={theme.palette.primary.main}
                    fontSize={'0.9rem'}>
                    <CopyToClipboard textToCopy={qrcode[0]} notification='snackbar' />
                    {minimizeStr(qrcode[0])}
                  </Box>
                </Box>
              </Box>

              <Box>
                <QRCodeSVG
                  size={256}
                  value={qrcode[1]}
                  bgColor={"transparent"}
                  fgColor={theme.palette.primary.main}
                // includeMargin
                />
              </Box>
            </>
          }
          {secret &&
            <Box
              sx={{ wordWrap: "break-word" }}
            >
              <Box
                my={2}
                display={'flex'}
                justifyContent={'space-between'}
              >
                <Box
                  textTransform={'uppercase'}
                  fontSize={'0.9rem'}
                >
                  Account:
                </Box>
                <Box
                  color={theme.palette.primary.main}
                  fontSize={'0.9rem'}>
                  {secret[0]}
                </Box>
              </Box>

              <Box mt={2}>
                <Box
                  mb={1}
                  color={theme.palette.primary.main}
                  textTransform={'uppercase'}
                  fontSize={'0.8rem'}
                >
                  Mnemonic phrase:
                </Box>
                <Box
                  color={theme.palette.secondary.main}
                  fontSize={'0.9rem'}
                >
                  {secret[2]} <CopyToClipboard textToCopy={secret[2]} notification='snackbar' />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box my={2}>
                <Box
                  mb={1}
                  color={theme.palette.primary.main}
                  textTransform={'uppercase'}
                  fontSize={'0.8rem'}
                >
                  Private Key data:
                </Box>
                <Box
                  color={theme.palette.secondary.main}
                  fontSize={'0.9rem'}
                >
                  {secret[1]}
                </Box>
              </Box>
            </Box>
          }
        </DialogContent>

      </Dialog>

    </>
  )

}