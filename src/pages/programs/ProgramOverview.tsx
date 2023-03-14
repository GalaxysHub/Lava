import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Link, Skeleton, Tab, Table, TableCell, TableRow, Tabs, useTheme } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import JsonView from "../../components/helpers/JsonView";
import { formatBytes, minimizeStr } from "../../utils/helper";
import { AppContext } from "../../context/main";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";


interface ProgramOverviewProps {
  programPubkeyStr: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramOverview(props: ProgramOverviewProps) {

  const { programPubkeyStr } = props;

  const params = useParams();
  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const idl = workspace?.programs[params.programId!].idl!;
  const size = workspace?.programs[params.programId!].size!;

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

  const [balance, setBalance] = useState(0);

  const fetchBalance = () => {
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(params.programId!);
    }
    catch (err) {
      return null;
    }

    const connection = new Connection(workspace?.RPC!, "confirmed");
    connection.getBalance(pubkey).then(balance => {
      setBalance(balance);
    })
      .catch((error) => {
        // console.log(error);
      })
      .finally(() => {
        // TODO
      })
  }

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="IDL Data" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <Box style={{ maxHeight: '100%', overflow: 'auto' }}>
        <TabPanel value={value} index={0}>
          <Box>
            <Table size="medium" className="table-striped">

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Address::
                </TableCell>
                <TableCell align="right">

                  <Box color={theme.palette.primary.main}>
                    <CopyToClipboard textToCopy={programPubkeyStr} notification='snackbar' />
                    {minimizeStr(programPubkeyStr, 10, 10)}
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Name:
                </TableCell>
                <TableCell align="right">
                  {idl.name}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Version:
                </TableCell>
                <TableCell align="right">
                  {idl.version}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Total Instructions:
                </TableCell>
                <TableCell align="right">
                  {idl.instructions.length}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  State accounts:
                </TableCell>
                <TableCell align="right">
                  {idl.accounts?.length}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Deployed:
                </TableCell>
                <TableCell align="right">
                  {workspace?.isLocalnet ? 'YES' : 'YES'}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Account:
                </TableCell>
                <TableCell align="right">
                  <Link component={NavLink} to={`/accounts/${params.programId!}`}>VIEW</Link>
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  Size:
                </TableCell>
                <TableCell align="right">
                  {size ? formatBytes(size) : <Skeleton />}
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ textTransform: 'uppercase' }}>
                  <Box color={theme.palette.primary.main}>
                    Native Balance:
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box color={theme.palette.primary.main}>
                    {balance ? `${balance / LAMPORTS_PER_SOL} SOL` : <Skeleton />}
                  </Box>
                </TableCell>
              </TableRow>

            </Table>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{ overflow: 'auto', wordBreak: 'break-all' }} fontSize={'0.9rem'}>
            <JsonView data={idl} name={`Program ${minimizeStr(params.programId!)}`} />
          </Box>
        </TabPanel>
      </Box>
    </>
  )

}