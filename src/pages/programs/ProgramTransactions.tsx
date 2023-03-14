import React, { useContext } from "react"
import { NavLink, useParams, Link as RouterLink } from "react-router-dom";
import { AccountInfo, ConfirmedSignatureInfo, Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { AppContext } from "../../context/main";
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, useTheme } from "@mui/material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { timeConverter, timeSince } from "../../utils/helper";


interface ProgramTransactionsProps {
  programPubkeyStr: string;
}

export default function ProgramTransactions(props: ProgramTransactionsProps) {

  const { programPubkeyStr } = props;

  const params = useParams();
  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [accountInfo, setAccountInfo] = React.useState<AccountInfo<Buffer | ParsedAccountData> | null>(null);
  const [accountTxs, setAccountTxs] = React.useState<ConfirmedSignatureInfo[]>([]);

  const fetchAccount = (account: string) => {
    if (workspace) {
      const accountPubkey = new PublicKey(account);
      const connection = new Connection(workspace?.RPC, "confirmed");
      connection.getParsedAccountInfo(accountPubkey)
        .then(accountInfo => {
          setAccountInfo(accountInfo.value)
        })
    }
  }

  const fetchAccountTransactions = (account: string) => {
    if (workspace) {
      const accountPubkey = new PublicKey(account);
      const connection = new Connection(workspace?.RPC, "confirmed");
      connection.getSignaturesForAddress(accountPubkey, { limit: 20 })
        .then(txs => {
          // TODO: need a limit here
          setAccountTxs(txs)
        })
    }
  }

  React.useEffect(() => {
    if (programPubkeyStr) {
      fetchAccount(programPubkeyStr);
    }

    console.log('programPubkeyStr', programPubkeyStr)

    if (programPubkeyStr && workspace) {
      const accountPubkey = new PublicKey(programPubkeyStr);
      const connection = new Connection(workspace?.RPC, "confirmed");
      const client = connection.onAccountChange(accountPubkey, account => {
        // TODO need to fix data type?
        setAccountInfo(account);
      })


      return () => {
        connection.removeAccountChangeListener(client);
      }
    }

  }, []);

  React.useEffect(() => {
    fetchAccountTransactions(programPubkeyStr);
  }, [accountInfo]);

  return (
    <>
      {accountTxs && (
        <TableContainer sx={{maxHeight:'30vh'}}>

          <Table size="small" className="table-striped">

            <TableBody>

              {accountTxs.map((item) => (
                <TableRow hover key={item.signature}>

                  <TableCell align="left">
                    <Box
                      className='long-string-left'
                      sx={{ maxWidth: '500px' }}
                    >
                      <CopyToClipboard textToCopy={item.signature} notification='snackbar' />
                      <Link component={NavLink} to={`/txs/${item.signature}`}>
                        {item.signature}
                      </Link>
                    </Box>
                  </TableCell>

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
    </>
  )

}