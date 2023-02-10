
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { minimizeStr } from '../../utils/helper';

interface TransactionDummy {
  signature: string
  block: string
  status: boolean,
  timestamp: string
  instructions: string
  fee: number
}

export default function TransactionListPage() {


  let dummyData:Array<TransactionDummy> = [
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804030", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804031", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804032", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804033", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804034", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804035", status: false, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804036", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804037", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804038", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804039", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804040", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
    {signature: "s2Khf7AuK8VDiiY65fnVPNg5FTjtUNb5YgEMF2jrsaskF5aELiPqfZmPUKydvWM4Augjoy3kmp72dnK9tAwyc", block:"76804041", status: true, timestamp:"February 09, 2023 03:27:13 +UTC", instructions:"Vote", fee:0},
  ];

  return (
    <>
      {/* <h2>Transaction list</h2> */}

      {dummyData && (
        <TableContainer>

          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="left">TX SIGNATURE</TableCell>
                <TableCell align="left">BLOCK HEIGHT</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">TIMESTAMP</TableCell>
                <TableCell align="center">INSTRUCTIONS</TableCell>
                <TableCell align="center">FEE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map((item) => (
                <TableRow hover key={item.signature}>
                  <TableCell align="left">
                    {minimizeStr(item.signature, 20, 20)}
                    <CopyToClipboard textToCopy={item.signature} notification='snackbar' />
                  </TableCell>

                  <TableCell align="left">
                    {item.block}
                    <CopyToClipboard textToCopy={item.block} notification='snackbar' />
                  </TableCell>

                  <TableCell align="center">
                      {item.status
                      ?
                      <TaskAltIcon fontSize='small' color="success" sx={{ mb: -0.3 }} />
                      :
                      <CancelIcon fontSize='small' color="error" sx={{ mb: -0.3 }} />}
                  </TableCell>

                  <TableCell align="center">
                    {item.timestamp}
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