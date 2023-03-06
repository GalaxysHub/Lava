import React, { useContext, useEffect, useState } from "react"
import { Box, Chip, Grid, Link, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, useTheme } from "@mui/material"
import { Connection, LAMPORTS_PER_SOL, ParsedAccountsModeBlockResponse, ParsedBlockResponse, ParsedMessageAccount } from "@solana/web3.js";
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

interface TransactionCardProps {
  index: number;
  transaction: (Omit<ParsedBlockResponse["transactions"][number], "transaction"> & {
    transaction: Pick<ParsedBlockResponse["transactions"][number]["transaction"], "signatures"> & {
      accountKeys: ParsedMessageAccount[];
    };
  });
}


function TransactionCard(props: TransactionCardProps) {
  const theme = useTheme();
  const { index, transaction } = props;

  // const parsedTxInfo: any[] | undefined = (transactionParsedInfo as ParsedInstruction).parsed.info;

  return (
    <Box
      py={2}
      borderBottom={`1px dashed ${theme.palette.divider}`}
      sx={{ minHeight: '80px' }}
      fontSize={'0.8rem'}
    >
      <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Chip variant='outlined' label={`#${index + 1}`} size="small" color='primary' />

        </Box>
        <Box>
          <Box sx={{ textAlign: 'right' }} color={theme.palette.primary.main} className={'long-string'}>
            <CopyToClipboard textToCopy={transaction.transaction.signatures[0]} notification='snackbar' />
            <Link component={NavLink} to={`/txs/${transaction.transaction.signatures[0]}`} >
              {minimizeStr(transaction.transaction.signatures[0], 25, 25)}
            </Link>
          </Box>
        </Box>
      </Box>

      <Box display='flex' sx={{ justifyContent: 'flex-end' }} py={0.5} color={theme.palette.secondary.main}>
        {!transaction.meta?.err
          ?
          <Chip label="success" size="small" color="success" variant='outlined' />
          :
          <Chip label="fail" size="small" color="error" variant='outlined' />
        }
      </Box>

      <Box display='flex' sx={{ justifyContent: 'flex-end' }} color={theme.palette.secondary.main}>
        Fee: {transaction.meta?.fee && (transaction.meta.fee / LAMPORTS_PER_SOL)} SOL
      </Box>

    </Box>
  );
}

export default function BlockDetailsPage() {

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

  const [block, setBlock] = useState<ParsedAccountsModeBlockResponse | null>(null);

  const fetchBlock = (slot: number) => {
    if (workspace) {
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getParsedBlock(slot).then(block => {
        setBlock(block);
      })


    }
  }

  useEffect(() => {
    if (params.blockId) {
      fetchBlock(Number(params.blockId));
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
              <Box className='page-header'>Block Details</Box>
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
                      Blockhash:
                    </TableCell>

                    <TableCell align="right">

                      {block
                        ?
                        <>
                          <CopyToClipboard textToCopy={block.blockhash} notification='snackbar' />
                          <Box sx={{ maxWidth: '400px' }} className='long-string'>
                            {block.blockhash}
                          </Box>
                        </>
                        : <Skeleton />}

                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left">
                      Slot:
                    </TableCell>

                    <TableCell align="right">
                      {block?.blockHeight ?
                        <>
                          <CopyToClipboard textToCopy={block.blockHeight.toString()} notification='snackbar' />
                          {block.blockHeight?.toLocaleString()}
                        </>
                        : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left">
                      Timestamp:
                    </TableCell>

                    <TableCell align="right">
                      {block?.blockTime ? `${timeConverter(block.blockTime)} (${timeSince(block.blockTime)})` : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left">
                      Parent Blockhash:
                    </TableCell>

                    <TableCell align="right">
                      {block?.previousBlockhash ?
                        <>
                          <CopyToClipboard textToCopy={block.previousBlockhash} notification='snackbar' />
                          {block.previousBlockhash}
                        </>
                        : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left" >
                      Parent Slot:
                    </TableCell>

                    <TableCell align="right">
                      {block?.parentSlot ?
                        <>
                          <CopyToClipboard textToCopy={block.parentSlot.toString()} notification='snackbar' />
                          <Link component={NavLink} to={`/blocks/${block.parentSlot}`}>{block.parentSlot.toLocaleString()}</Link>
                        </>
                        : <Skeleton />}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell align="left" >
                      Transactions:
                    </TableCell>

                    <TableCell align="right">
                      {block?.transactions ? <>{block?.transactions.length}</> : <Skeleton />}
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
              <Tab label="Trnsactions" {...a11yProps(0)} />
              {/* <Tab label="Programs" {...a11yProps(1)} />
              <Tab label="Accounts" {...a11yProps(2)} /> */}
              <Tab label="JSON View" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <Box style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <TabPanel value={value} index={0}>
              {block &&
                block.transactions.map((item, index) => (
                  <TransactionCard
                    index={index}
                    transaction={item}
                  />
                ))
              }
            </TabPanel>

            {/* <TabPanel value={value} index={1}>
            
            </TabPanel>

            <TabPanel value={value} index={2}>
              
            </TabPanel> */}

            <TabPanel value={value} index={1}>
              {block &&
                <Box sx={{ wordBreak: 'break-all' }} fontSize={'0.85rem'}>
                  <JsonView data={block} />
                </Box>
              }
            </TabPanel>
          </Box>

        </Grid>
      </Grid>

    </>
  )

}