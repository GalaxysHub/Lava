import React, { useContext, useState } from "react";
import { Keypair } from "@solana/web3.js";
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
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { QRCodeSVG } from 'qrcode.react';
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, Stack, Tab, Tabs, Tooltip } from "@mui/material";


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

  const { accounts } = useContext(AppContext);

  const [secret, setSecret] = useState<string>("")
  const showPrivateData = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    // console.log(value.secretKey)

    setSecret(value.secretKey.toString());
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
  const handleQRClick = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    // console.log(value.publicKey)
    setQrcode(value.publicKey.toString());
    setDialogOpen(true);
  };

  const swapToWallet = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    console.log(value.publicKey)
  }

  const addFunds = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    console.log(value.publicKey)
  }

  const saveJsonFile = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    console.log(value.publicKey)
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

  return (
    <>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Workspace Active Accounts" {...a11yProps(0)} />
          <Tab label="Closed Accounts" {...a11yProps(0)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        {accounts && (
          <TableContainer>

            <Table size="medium">
              {/* <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="left">PUBLIC KEY</TableCell>
                <TableCell align="center">NATIVE BALANCE</TableCell>
                <TableCell align="center">SPL ASSETS</TableCell>
                <TableCell align="center">TXS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead> */}
              <TableBody>
                {accounts.map((item, index) => (
                  <TableRow hover key={item.keypair.publicKey.toString()} sx={{ height: "50px" }}>
                    <TableCell align="center" width={1}>
                      {/* {index + 1} */}
                      <FiberManualRecordIcon fontSize="inherit" color="primary" />
                    </TableCell>

                    <TableCell align="left" className="key-item">
                      <KeyItem {...item} />
                    </TableCell>

                    <TableCell align="center">
                      0 SOL
                    </TableCell>

                    <TableCell align="center">
                      NO ASSETS
                    </TableCell>

                    <TableCell align="center">
                      0
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="end"
                        spacing={2}
                      >
                        <Tooltip title="Add funds" arrow placement="top" >
                          <OpacityIcon onClick={(event) => addFunds(event, item.keypair)} fontSize="small" sx={{ cursor: "pointer" }} />
                        </Tooltip>

                        <Tooltip title="Swap to Wallet" arrow placement="top" >
                          <AccountBalanceWalletIcon onClick={(event) => swapToWallet(event, item.keypair)} fontSize="small" sx={{ cursor: "pointer" }} />
                        </Tooltip>

                        <Tooltip title="Show QR" arrow placement="top" >
                          <QrCodeIcon onClick={(event) => handleQRClick(event, item.keypair)} fontSize="small" sx={{ cursor: "pointer" }} />
                        </Tooltip>

                        <Tooltip title="Show Private key" arrow placement="top" >
                          <KeyIcon onClick={(event) => showPrivateData(event, item.keypair)} fontSize="small" sx={{ cursor: "pointer" }} />
                        </Tooltip>

                        <Tooltip title="Save JSON file" arrow placement="top" >
                          <FileDownloadIcon onClick={(event) => saveJsonFile(event, item.keypair)} fontSize="small" sx={{ cursor: "pointer" }} />
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