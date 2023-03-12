
import React, { useContext, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { minimizeStr, timeConverter, timeSince } from '../../utils/helper';
import { numberWithSpaces } from '../../utils/helper';
import { AppContext } from "../../context/main";
import { ConfirmedSignatureInfo, Connection, PublicKey, TransactionConfirmationStatus, TransactionError } from "@solana/web3.js";
import { TAccount } from "../../libs/types";
import { NavLink } from "react-router-dom";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography, useTheme } from "@mui/material";
import TransactionsFilter from "./TransactionsFilter";


interface Transaction {
  account: TAccount,
  signature: string;
  slot: number;
  err: TransactionError | null;
  memo: string | null;
  blockTime?: number | null | undefined;
  confirmationStatus?: TransactionConfirmationStatus | undefined;
}

export default function TransactionListPage() {

  const { workspace } = useContext(AppContext);

  const theme = useTheme();

  const [pageItems, setPageItems] = useState(20);
  const handleChangeItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageItems(Number(event.target.value));
  };

  const [txs, setTxs] = useState<Transaction[]>()

  const [open, setOpen] = useState(false);

  const openFilterHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    setOpen(true);
  }

  // Dialog
  const handleFilterClose = () => {
    setOpen(false);
  };

  const accounts = workspace?.accounts;

  const [keysToFetch, setKeysToFetch] = useState<PublicKey[]>([]);

  const isPubkeyInList = (pubkey: PublicKey) => {
    for (let i = 0; i < keysToFetch.length; i++) {
      if (keysToFetch[i].toString() === pubkey.toString()) {
        return i;
      }
    }
    return -1;
  }

  const handleToggle = (pubkey: PublicKey) => () => {
    const currentIndex = isPubkeyInList(pubkey);
    const newKeys = [...keysToFetch];

    if (currentIndex === -1) {
      newKeys.push(pubkey);
    } else {
      newKeys.splice(currentIndex, 1);
    }
    setKeysToFetch(newKeys);
  };

  const handleApply = () => {

  }

  const handleSelectAll = () => {
    let newKeys: PublicKey[] = [];
    accounts?.forEach(item => newKeys.push(item.keypair.publicKey))
    setKeysToFetch(newKeys);
  }

  const handleClearAll = () => {
    setKeysToFetch([]);
  }

  const fetchTransactions = () => {
    if (workspace?.accounts) {

      const connection = new Connection(workspace.RPC, "confirmed");
      const txPromises: Promise<ConfirmedSignatureInfo[]>[] = [];

      keysToFetch.forEach(pubkey => {
        const signature = connection.getSignaturesForAddress(pubkey);
        txPromises.push(signature);
      });

      Promise.all(txPromises)
        .then(responses => {
          const tempTxs: Transaction[] = [];
          responses.forEach((element, index) => {
            element.forEach(el => {
              if (workspace.accounts) {
                const tx: Transaction = {
                  account: workspace.accounts[index],
                  signature: el.signature,
                  slot: el.slot,
                  err: el.err,
                  memo: el.memo,
                  blockTime: el.blockTime,
                  confirmationStatus: el.confirmationStatus,
                }
                tempTxs.push(tx)
              }
            });
          });
          setTxs(tempTxs);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  useEffect(() => {

    // Initial fetch
    fetchTransactions();
    let interval = setInterval(() => fetchTransactions(), 2000);
    //destroy interval on unmount
    return () => clearInterval(interval)

  }, [keysToFetch]);

  return (
    <>

      <Box mb={'10px'} className="filter-bar">
        <Link
          href="#"
          onClick={openFilterHandle}
          color="primary.main"
        >
          <FilterListIcon color="primary" fontSize="small" sx={{ mb: '-4px', mr: '7px' }} />
          {`Accounts Filter:  `} 
          <Typography component={'span'} color={theme.palette.primary.main} borderBottom={`1px dashed ${theme.palette.primary.main}`}>
            {`${keysToFetch.length > 0 ? keysToFetch.length : 'no'} account(s) to fetch`}
          </Typography>
        </Link>

      </Box>

      {txs && (
        <TableContainer>

          <Table size="small" className="table-striped">
            <TableHead>
              <TableRow>
                <TableCell align="center">ACCOUNT</TableCell>
                <TableCell align="left">TX SIGNATURE</TableCell>
                <TableCell align="center">SLOT</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">BLOCK TIME</TableCell>
                <TableCell align="center">CONFIRMATION</TableCell>
                <TableCell align="center"><MoreHorizIcon /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txs.map((item) => (
                <TableRow hover key={item.signature}>

                  <TableCell align="center">
                    Account #{item.account.index}
                  </TableCell>

                  <TableCell align="left">
                    {/* {minimizeStr(item.signature, 16, 16)} */}
                    {item.signature}
                    <CopyToClipboard textToCopy={item.signature} notification='snackbar' />
                  </TableCell>

                  <TableCell align="center">
                    {numberWithSpaces(item.slot)}
                    {/* <CopyToClipboard textToCopy={item.block} notification='snackbar' /> */}
                  </TableCell>

                  <TableCell align="center">
                    {!item.err
                      ?
                      <TaskAltIcon fontSize='inherit' color="primary" sx={{ mb: -0.3 }} />
                      :
                      <CancelIcon fontSize='inherit' color="error" sx={{ mb: -0.3 }} />}
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

                  <TableCell align="center">
                    {item.confirmationStatus}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Details" arrow placement="left" >
                      <IconButton component={NavLink} to={`/txs/${item.signature}`} aria-label="more" size="small">
                        <RemoveRedEyeIcon fontSize="inherit" color='primary' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

        </TableContainer>
      )}

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleFilterClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            Accounts to fetch
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleFilterClose}
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

        <DialogContent>
          <Box>
            <Box>
              <List
                dense
                component="nav"
                sx={{ maxHeight: '70vh' }}
              >
                {workspace?.accounts && workspace?.accounts.map(item => (
                  <ListItem
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        size="small"
                        color="primary"
                        onChange={handleToggle(item.keypair.publicKey)}
                        checked={isPubkeyInList(item.keypair.publicKey) !== -1}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    }
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>

                    <ListItemText
                      primary={item.alias ? `#${item.index} ${item.alias}` : `Account #${item.index}`}
                      secondary={item.keypair.publicKey.toString()}
                    />

                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>

            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ m: 0, px: 3, py: 1.5, justifyContent: 'space-between' }}>
          <Button
            variant='outlined'
            onClick={handleApply}
          >
            Apply
          </Button>

          <Box>
            <Button
              size="small"
              onClick={handleClearAll}
            >
              CLEAR
            </Button>

            <Button
              size="small"
              onClick={handleSelectAll}
            >
              SELECT ALL
            </Button>

          </Box>

        </DialogActions>

      </Dialog>
    </>
  )

}