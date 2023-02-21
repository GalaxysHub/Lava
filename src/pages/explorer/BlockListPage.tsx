import React from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from "@mui/material";

export default function BlockListPage() {

  // const dummyData: string[] = [].fill(20);

  const dummyData = Array(20).fill('');

  return (
    <>
    { dummyData && (
      <TableContainer>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">HEIGHT</TableCell>
              <TableCell align="center">STATUS</TableCell>
              <TableCell align="center">TIMESTAMP</TableCell>
              <TableCell align="center">TXS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((item, index) => (
              <TableRow hover key={item}>
                <TableCell>
                  <Skeleton />
                </TableCell>

                <TableCell>
                  <Skeleton />
                </TableCell>

                <TableCell>
                  <Skeleton />
                </TableCell>

                <TableCell>
                  <Skeleton />
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