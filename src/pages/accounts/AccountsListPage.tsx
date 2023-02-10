import React, { useContext, useState } from "react";
import { Keypair } from "@solana/web3.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import KeyIcon from '@mui/icons-material/Key';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { QRCodeSVG } from 'qrcode.react';
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, Stack } from "@mui/material";


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

  // QR-Code Dialog
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
                <TableRow hover key={item.publicKey.toString()}>
                  <TableCell align="center">
                    {index + 1}
                  </TableCell>

                  <TableCell align="left">
                    {item.publicKey.toString()}
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      justifyContent="center"
                      spacing={2}
                    >
                      <CopyToClipboard textToCopy={item.publicKey.toString()} notification='snackbar' />
                      <QrCode2Icon onClick={(event) => handleQRClick(event, item)} fontSize="small" sx={{cursor:"pointer" }} />
                      <KeyIcon onClick={(event) => showPrivateData(event, item)} fontSize="small" sx={{ cursor:"pointer" }} />
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