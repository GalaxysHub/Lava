import React, { useContext, useEffect, useState } from "react";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QrCodeIcon from '@mui/icons-material/QrCode';
import KeyIcon from '@mui/icons-material/Key';
import KeyItem from "./KeyItem";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OpacityIcon from '@mui/icons-material/Opacity';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { QRCodeSVG } from 'qrcode.react';
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, IconButton, Skeleton, Stack, Tab, Tabs, Tooltip, useTheme } from "@mui/material";


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

  const [secret, setSecret] = useState<string>("")
  const showPrivateData = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    // console.log(value.secretKey)
    const secret = workspace?.accounts![value].keypair.secretKey.toString()!;
    setSecret(secret);
    setDialogOpen(true);
  }

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setQrcode("");
    setSecret("");
  };

  const [qrcode, setQrcode] = useState<string>("")
  const handleQRClick = (event: React.MouseEvent<HTMLButtonElement>, value: string) => {
    // console.log(value.publicKey)
    setQrcode(value);
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

  const [balances, setBalances] = useState<Record<string, number>>({});

  const updateAccounts = () => {
    if (workspace?.accounts) {

      const connection = new Connection(workspace.RPC, "confirmed");


      Object.keys(workspace.accounts).forEach(key => {
        connection.getBalance(workspace.accounts![key].keypair.publicKey)
          .then(balance => {
            // console.log(workspace.accounts![key].keypair.publicKey, balance)
            // let newBalances: Record<string, number> = { ...balances };
            // newBalances[key] = balance;
            // console.log(newBalances)
            // setBalances(newBalances);
            setBalances(oldBalances => {
              oldBalances[key] = balance;
              console.log('old:', oldBalances)
              return oldBalances;
            })
          })
          .catch((error) => {
            console.log(error);
          })
      })

    }
  }

  useEffect(() => {
    // console.log('balances: ', balances);
    updateAccounts();
  }, []);

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

                      <TableCell align="center">
                        {balances[key] ? `${balances[key] / LAMPORTS_PER_SOL} SOL` : <Skeleton height={30} />}
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
        <DialogContent >
          {qrcode && <QRCodeSVG size={256} value={qrcode} />}
          {secret && <Box sx={{ wordWrap: "break-word" }}>{secret}</Box>}
        </DialogContent>

      </Dialog>

    </>
  )

}