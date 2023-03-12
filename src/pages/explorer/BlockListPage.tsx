import React, { useContext, useEffect, useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, FormControlLabel, IconButton, Radio, RadioGroup, Skeleton, Switch, Tooltip, useTheme } from "@mui/material";
import { AppContext } from "../../context/main";
import { BlockResponse, Connection } from "@solana/web3.js";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { NavLink } from "react-router-dom";
import { timeConverter } from "../../utils/helper";
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";

export default function BlockListPage() {

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [liveMode, setLiveMode] = useState(true)
  const handleLiveModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveMode(event.target.checked);
  };

  const [items, setItems] = useState(20);
  const handleChangeItems = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItems(Number(event.target.value));
  };

  const [blocks, setBlocks] = useState<(BlockResponse | null)[]>([])

  const fetchBlock = (slot: number) => {
    if (workspace) {
      const connection = new Connection(workspace.RPC, "confirmed");
      connection.getBlock(slot).then(data => {
        setBlocks(oldData => [data, ...oldData.slice(0, (items - 1))])
      })
    }
  }

  useEffect(() => {

    if (liveMode && workspace) {
      const connection = new Connection(workspace.RPC, "confirmed");
      const client = connection.onSlotUpdate(slot => {
        if (slot.type === 'optimisticConfirmation') {
          fetchBlock(slot.slot);
        }
      })


      return () => {
        connection.removeSlotChangeListener(client);
      }
    }


  }, [liveMode, items]);

  return (
    <>
      <Box
        // className="filter-bar"
        display={'flex'}
        sx={{ justifyContent: 'space-between' }}
      >
        <Box display={'flex'}>
          <Box color={theme.palette.primary.main}>
            Blocks Live mode:
          </Box>

          <Box>
            <Switch
              color="primary"
              size="small"
              checked={liveMode}
              onChange={handleLiveModeChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
        </Box>

        <Box display={'flex'}>
          <Box color={theme.palette.primary.main}>
            Items per page:
          </Box>

          <Box sx={{ mt: '-5px' }}>
            <RadioGroup
              row
              aria-labelledby="form-control-items"
              name="items"
              onChange={handleChangeItems}
              defaultValue="20"
            >
              <FormControlLabel
                value="20"
                control={<Radio size="small" />}
                label="20"
                labelPlacement="start"
              />
              <FormControlLabel
                value="30"
                control={<Radio size="small" />}
                label="30"
                labelPlacement="start"
              />
              <FormControlLabel
                value="50"
                control={<Radio size="small" />}
                label="50"
                labelPlacement="start"
              />
            </RadioGroup>
          </Box>
        </Box>

      </Box>

      {blocks?.length > 0 && (
        <TableContainer
          sx={{ maxHeight: '90vh' }}
        >

          <Table
            size="small"
            stickyHeader
            aria-label="sticky table"
            className="table-striped"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">SLOT</TableCell>
                <TableCell align="left">BLOCK HASH</TableCell>
                <TableCell align="center">TIMESTAMP</TableCell>
                <TableCell align="center">TXS</TableCell>
                <TableCell align="center"><MoreHorizIcon /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocks.map((item, index) => (
                <TableRow hover key={item?.blockhash}>
                  <TableCell>
                    {item?.parentSlot ? item.parentSlot : <Skeleton />}
                  </TableCell>

                  <TableCell align="left">
                    {item?.blockhash ?
                      <>
                        {item.blockhash}
                        <CopyToClipboard textToCopy={item.blockhash} notification='snackbar' />
                      </>
                      : <Skeleton />}
                  </TableCell>

                  <TableCell align="center">
                    {item?.blockTime ? timeConverter(item.blockTime) : <Skeleton />}
                  </TableCell>

                  <TableCell align="center">
                    {item?.transactions ? item.transactions.length : <Skeleton />}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Details" arrow placement="left" >
                      <IconButton component={NavLink} to={`/blocks/${item?.parentSlot}`} aria-label="more" size="small">
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
    </>
  )

}