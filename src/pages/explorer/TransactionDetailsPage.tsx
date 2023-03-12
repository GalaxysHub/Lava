import { Block } from "@mui/icons-material";
import { Box, Chip, Grid, Link, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, useTheme } from "@mui/material"
import { Connection, LAMPORTS_PER_SOL, TransactionResponse, PublicKey, TransactionInstruction, ParsedTransactionWithMeta, ParsedInstruction, PartiallyDecodedInstruction, ParsedMessageAccount, RpcResponseAndContext, SignatureStatus } from "@solana/web3.js";
import React, { useContext, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import JsonView from "../../components/helpers/JsonView";
import { AppContext } from "../../context/main";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { minimizeStr, timeConverter, timeSince } from "../../utils/helper";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AccountCardProps {
  index: number;
  account: ParsedMessageAccount;
  preBalance: number | undefined;
  postBalance: number | undefined;
}

interface InstructionCardProps {
  index: number;
  instruction: ParsedInstruction | PartiallyDecodedInstruction;
}


export default function TransactionDetailsPage() {

  const params = useParams();
  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  function AccountCard(props: AccountCardProps) {

    const { index, account, preBalance, postBalance } = props;
    const isProgram = false;

    return (
      <Box
        py={2}
        borderBottom={`1px dashed ${theme.palette.divider}`}
        sx={{ minHeight: '80px' }}
        fontSize={'0.8rem'}
      >

        <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
          <Box><Chip variant='outlined' label={`#${index + 1}`} size="small" color='primary' /></Box>
          <Box>
            <Box sx={{ textAlign: 'right', textTransform: 'uppercase' }} color={theme.palette.primary.main}>
              Unknown account
            </Box>
            <Box>
              <CopyToClipboard textToCopy={account.pubkey.toBase58()} notification='snackbar' />
              <Link component={NavLink} to={`/accounts/${account.pubkey.toBase58()}`} color={theme.palette.secondary.main}>
                {account.pubkey.toBase58()}
              </Link>
            </Box>
          </Box>
        </Box>

        <Box py={0.5}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            {account.signer && <Chip label={'signer'} size="small" color='primary' />}
            {account.writable && <Chip label="writable" size="small" />}
            {isProgram && <Chip variant='outlined' label="program" size="small" />}
          </Stack>
        </Box>
        {preBalance !== undefined && postBalance !== undefined && (
          <Box display={'flex'} sx={{ justifyContent: 'space-between' }} pt={1}>
            <Box color={theme.palette.primary.main}>Balance change:</Box>
            <Box color={theme.palette.secondary.dark}>
              {`${preBalance / LAMPORTS_PER_SOL} SOL → ${postBalance / LAMPORTS_PER_SOL} SOL  (${(postBalance - preBalance) / LAMPORTS_PER_SOL})`}
            </Box>
          </Box>
        )}
      </Box>
    );
  }


  function InstructionCard(props: InstructionCardProps) {
    const { index, instruction } = props;
    const parsedInfo: any[] | undefined = (instruction as ParsedInstruction).parsed.info;
    console.log(parsedInfo);
    return (
      <Box
        py={2}
        borderBottom={`1px dashed ${theme.palette.divider}`}
        sx={{ minHeight: '80px' }}
        fontSize={'0.8rem'}
      >
        <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
          <Box><Chip variant='outlined' label={`#${index + 1}`} size="small" color='primary' /></Box>
          <Box>
            <Box sx={{ textAlign: 'right', textTransform: 'uppercase' }} color={theme.palette.primary.main}>
              UNKNOWN PROGRAM
            </Box>
            <Box>
              <CopyToClipboard textToCopy={instruction.programId.toBase58()} notification='snackbar' />
              {instruction.programId.toBase58()}
            </Box>
          </Box>
        </Box>

        <Box color={theme.palette.primary.main}>
          Type: {String((instruction as ParsedInstruction).parsed.type).toUpperCase()}
        </Box>

        <Box color={theme.palette.secondary.main}>
          {parsedInfo && (
            Object.entries(parsedInfo).map(([k, v]) => (
              <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
                <Box>
                  • {k}:
                </Box>
                <Box>
                  <CopyToClipboard textToCopy={v} notification='snackbar' />
                  {String(v)}
                </Box>
              </Box>
            ))
          )}
        </Box>

      </Box>
    );
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

  const [tx, setTx] = useState<TransactionResponse | null>(null);
  const [parsedTx, setParsedTx] = useState<ParsedTransactionWithMeta | null>(null);
  const [txStatus, setTxStatus] = useState<RpcResponseAndContext<SignatureStatus | null>>();

  const fetchTxStatus = (signature: string) => {
    if (workspace) {
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getSignatureStatus(signature).then(tx => {
        // console.log(tx)
        setTxStatus(tx);
      })
    }
  }

  const fetchTx = (signature: string) => {
    if (workspace) {
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getTransaction(signature).then(tx => {
        // console.log(tx)
        setTx(tx);
      })

      connection.getParsedTransaction(signature).then(tx => {
        // console.log(tx)
        setParsedTx(tx);
      })

      fetchTxStatus(signature);
    }
  }

  useEffect(() => {
    if (params.txId) {
      fetchTx(params.txId);
    }
  }, []);

  return (
    <>

      <Grid container spacing={4}>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box
              p={1}
            // sx={{ borderBottom: 2, borderColor: `${theme.palette.primary.main}` }}
            >
              <Box className='page-header'>Transaction Details</Box>
            </Box>
          </Box>

          <Box>

            {/* <h2>Transaction Overview</h2> */}
            <br></br>

            <TableContainer>

              <Table size="medium" className="table-striped">
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
                      Signature:
                    </TableCell>

                    <TableCell align="right">

                      {tx
                        ?
                        <>
                          <CopyToClipboard textToCopy={tx.transaction.signatures[0]} notification='snackbar' />
                          <Box sx={{ maxWidth: '400px' }} className='long-string'>
                            {tx.transaction.signatures[0]}
                          </Box>
                        </>
                        : <Skeleton />}

                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Result:
                    </TableCell>

                    <TableCell align="right">
                      {tx
                        ?
                        <>
                          {!tx.meta?.err
                            ?
                            <Chip label="success" size="small" color="success" variant='outlined' />
                            :
                            <Chip label="fail" size="small" color="error" variant='outlined' />
                          }
                        </>
                        : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Timestamp:
                    </TableCell>

                    <TableCell align="right">
                      {tx?.blockTime ? `${timeConverter(tx.blockTime)} (${timeSince(tx.blockTime)})` : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Confirmation Status:
                    </TableCell>

                    <TableCell align="right">
                      {txStatus?.value !== undefined ?
                        (txStatus.value !== null ?
                          txStatus.value.confirmationStatus
                          : 'finalized')
                        : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left" >
                      Confirmations:
                    </TableCell>

                    <TableCell align="right">
                      {txStatus?.value !== undefined ?
                        (txStatus.value?.confirmations ?
                          txStatus.value.confirmations
                          : 'MAX')
                        : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Slot:
                    </TableCell>

                    <TableCell align="right">
                      {tx ?
                        <>
                          <CopyToClipboard textToCopy={tx.slot.toString()} notification='snackbar' />
                          <Link component={NavLink} to={`/blocks/${tx.slot}`}>{tx.slot.toLocaleString()}</Link>
                        </>
                        : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Recent Blockhash:
                    </TableCell>

                    <TableCell align="right">
                      {tx ?
                        <>
                          <CopyToClipboard textToCopy={tx.transaction.message.recentBlockhash} notification='snackbar' />
                          <Box sx={{ maxWidth: '400px' }} className='long-string'>
                            {tx.transaction.message.recentBlockhash}
                          </Box>
                        </> : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Fee (SOL):
                    </TableCell>

                    <TableCell align="right">
                      {tx ?
                        <>
                          {tx.meta?.fee ? tx.meta?.fee / LAMPORTS_PER_SOL : ''}
                        </> : <Skeleton />}
                    </TableCell>

                  </TableRow>

                  <TableRow hover>

                    <TableCell align="left">
                      Version:
                    </TableCell>

                    <TableCell align="right">
                      {tx ? <>{tx.transaction.message.version}</> : <Skeleton />}
                    </TableCell>

                  </TableRow>

                </TableBody>
              </Table>

            </TableContainer>
          </Box>


        </Grid>

        <Grid item sm={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
              <Tab label="Accounts" {...a11yProps(0)} />
              <Tab label="Instructions" {...a11yProps(1)} />
              <Tab label="Logs" {...a11yProps(2)} />
              <Tab label="JSON View" {...a11yProps(3)} />
            </Tabs>
          </Box>

          <Box style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <TabPanel value={value} index={0}>
              {parsedTx &&
                parsedTx.transaction.message.accountKeys.map((item, index) => (
                  <AccountCard
                    index={index}
                    account={item}
                    preBalance={tx?.meta?.preBalances[index]}
                    postBalance={tx?.meta?.postBalances[index]}
                  />
                ))
              }
            </TabPanel>

            <TabPanel value={value} index={1}>
              {parsedTx &&
                parsedTx.transaction.message.instructions.map((item, index) => (
                  <InstructionCard index={index} instruction={item} />
                ))
              }
            </TabPanel>

            <TabPanel value={value} index={2}>
              {tx &&
                tx.meta?.logMessages?.map((item, index) => (
                  <Box fontSize={'0.9rem'} color={theme.palette.secondary.main}>
                    # {item}
                  </Box>
                ))
              }
            </TabPanel>

            <TabPanel value={value} index={3}>
              {parsedTx &&
                <Box sx={{ wordBreak: 'break-all' }} fontSize={'0.85rem'}>
                  <JsonView data={parsedTx} name={`Transaction (${minimizeStr(parsedTx.transaction.signatures[0])})`} />
                </Box>
              }

              {txStatus &&
                <Box sx={{ wordBreak: 'break-all' }} fontSize={'0.85rem'}>
                  <JsonView data={txStatus} name="Transaction Status" />
                </Box>
              }
            </TabPanel>
          </Box>

        </Grid>
      </Grid>

    </>
  )

}