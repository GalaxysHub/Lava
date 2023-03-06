import React, { useContext, useState } from "react"
import { Box, IconButton, Popover, Tooltip, useTheme } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AppContext } from "../../context/main";
import Blinker from "../helpers/Blinker";

export default function NodeBlock() {

  const theme = useTheme();
  
  const { workspace } = useContext(AppContext);

  const [nodeStatus, setNodeStatus] = useState(true)

  const [data, setData] = useState({
    clusterStatus: true,
    currentEpoch: 0,
    currentBlock: 0,
    txCount: 0,
  })

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleNodeClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleStopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (workspace) {
      workspace.validator.stop();
      setNodeStatus(workspace.validatorStatus);
    }
  };

  const handleStartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (workspace) {
      workspace.validator.start();
      setNodeStatus(workspace.validatorStatus);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title="Click to show details" arrow placement="bottom" >
        <Box
          onClick={handleNodeClick}
          sx={{ cursor: 'pointer', mr: '10px' }}
        >
          <Box display={'inline-block'}>
            <span>Node Status</span>
            {workspace?.validatorStatus ?
              <Box component={'span'}><Blinker color='success' />RUNNING</Box>
              :
              <Box component={'span'} color={theme.palette.secondary.main}><Blinker color='error' />STOPPED</Box>
            }
          </Box>
          <ExpandMoreIcon fontSize='medium' />
        </Box>
      </Tooltip>

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
            <span>{workspace?.validator.hostname}:{workspace?.validator.rpcPort}</span>
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

      <Tooltip title="Stop Validator node" arrow placement="bottom" >
        <IconButton
          size='small'
          onClick={handleStopClick}
          disabled={!nodeStatus}
        // sx={{ ml: 2 }}
        >
          <StopIcon fontSize='small' sx={{ m: '2px' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Start Validator node" arrow placement="bottom" >
        <IconButton
          size='small'
          onClick={handleStartClick}
          disabled={nodeStatus}
        >
          <PlayArrowIcon fontSize='small' sx={{ m: '2px' }} />
        </IconButton>
      </Tooltip>

    </>
  )

}