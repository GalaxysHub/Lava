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
import { QRCodeSVG } from 'qrcode.react';
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, Stack, Tooltip } from "@mui/material";


export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
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

  return (
    <>
      {/* <h2>Accounts list</h2> */}

      {accounts && (
        <TableContainer>

          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="left">PUBLIC KEY</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
                <TableCell align="center">BALANCE</TableCell>
                <TableCell align="center">TXS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((item, index) => (
                <TableRow hover key={item.keypair.publicKey.toString()} sx={{height:"80px"}}>
                  <TableCell align="center">
                    {index + 1}
                  </TableCell>

                  <TableCell align="left" className="key-item">
                    <KeyItem {...item}/>
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      justifyContent="center"
                      spacing={2}
                    >
                      <Tooltip title="Add funds" arrow placement="top" >
                        <OpacityIcon onClick={(event) => addFunds(event, item.keypair)} fontSize="small" sx={{ cursor:"pointer" }} />
                      </Tooltip>

                      <Tooltip title="Swap to Wallet" arrow placement="top" >
                        <AccountBalanceWalletIcon onClick={(event) => swapToWallet(event, item.keypair)} fontSize="small" sx={{ cursor:"pointer" }} />
                      </Tooltip>
                      
                      <Tooltip title="Show QR" arrow placement="top" >
                        <QrCodeIcon onClick={(event) => handleQRClick(event, item.keypair)} fontSize="small" sx={{cursor:"pointer" }} />
                      </Tooltip>

                      <Tooltip title="Show Private key" arrow placement="top" >
                        <KeyIcon onClick={(event) => showPrivateData(event, item.keypair)} fontSize="small" sx={{ cursor:"pointer" }} />
                      </Tooltip>
                   
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    0 SOL
                  </TableCell>


                  <TableCell align="center">
                    0
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

        </TableContainer>
      )}

      <Dialog
        // fullWidth
        maxWidth='sm'
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent >
          {qrcode && <QRCodeSVG size={256} value={qrcode} />}
          {secret && <Box sx={{wordWrap: "break-word"}}>{secret}</Box>}
        </DialogContent>

      </Dialog>

    </>
  )

}