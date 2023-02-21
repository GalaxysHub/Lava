import React, { useContext, useState } from "react"
import { Box, Divider, IconButton, Popover } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppContext } from "../../context/main";
import Blinker from "../helpers/Blinker";

export default function NodeBlock() {

  const { settings } = useContext(AppContext);

  const [data, setData] = useState({
    clusterStatus: true,
    currentEpoch: 0,
    currentBlock: 0,
    txCount: 0,
  })

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Box>
        <span>Node Status</span>
        
        <span><Blinker />{true ? 'RUNNING' : 'STOPPED'}</span>
      </Box>

      <IconButton
        size='small'
        onClick={handleClick}
        // sx={{ ml: 2 }}
        aria-describedby={id}
        aria-label="node-expand"
        aria-controls={open ? 'node-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <ExpandMoreIcon fontSize='medium' />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box m={'20px'}>
          <Box>
            <span>RPC:</span>
            <span>{settings.validatorHostame}:{settings.vaidatorPort}</span>
          </Box>

          <Box>
            <span>Epoch:</span>
            <span>{data.currentEpoch}</span>
          </Box>

          <Box>
            <span>Slots:</span>
            <span>{data.currentBlock}</span>
          </Box>

          <Box>
            <span>Txs:</span>
            <span>{data.txCount}</span>
          </Box>
        </Box>
      </Popover>

    </>
  )

}