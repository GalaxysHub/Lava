
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
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { minimizeStr, timeSince } from '../../utils/helper';
import { Tooltip, useTheme } from '@mui/material';
import { numberWithSpaces } from '../../utils/helper';

interface TransactionDummy {
  signature: string
  block: number,
  status: boolean,
  timestamp: string
  instructions: string
  fee: number
}

export default function TransactionListPage() {

  const theme = useTheme();

  let dummyData: Array<TransactionDummy> = [
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804030, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804031, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804032, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804033, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804034, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804035, status: false, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804036, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804037, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804038, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804039, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804040, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804041, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804035, status: false, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804036, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804030, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804031, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804032, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804033, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804034, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804035, status: false, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804036, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804037, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804038, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804039, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804040, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804041, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804035, status: false, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
    { signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block: 76804036, status: true, timestamp: '2023-02-16T10:20:30Z', instructions: "Vote", fee: 0 },
  ]

  return (
    <>
      {/* <h2>Transaction list</h2> */}

      {dummyData && (
        <TableContainer>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">TX SIGNATURE</TableCell>
                <TableCell align="left">HEIGHT</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">TIME</TableCell>
                <TableCell align="center">INSTRUCTIONS</TableCell>
                <TableCell align="center">FEE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map((item) => (
                <TableRow hover key={item.signature}>
                  <TableCell align="left">
                    {minimizeStr(item.signature, 16, 16)}
                    <CopyToClipboard textToCopy={item.signature} notification='snackbar' />
                  </TableCell>

                  <TableCell align="left">
                    {numberWithSpaces(item.block)}
                    {/* <CopyToClipboard textToCopy={item.block} notification='snackbar' /> */}
                  </TableCell>

                  <TableCell align="center">
                    {item.status
                      ?
                      <TaskAltIcon fontSize='inherit' color="primary" sx={{ mb: -0.3 }} />
                      :
                      <CancelIcon fontSize='inherit' color="error" sx={{ mb: -0.3 }} />}
                  </TableCell>

                  <TableCell align="center">
                    {timeSince(item.timestamp)}
                    <Tooltip title={item.timestamp} arrow placement="right" >
                      <AccessTimeIcon fontSize="inherit" color={'secondary'} sx={{mb:'-2px', ml:'2px'}}/>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    {item.instructions}
                  </TableCell>

                  <TableCell align="center">
                    {item.fee}
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