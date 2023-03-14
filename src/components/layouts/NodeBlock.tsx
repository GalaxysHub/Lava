import React, { useContext, useState } from "react"
import { Box, Button, Dialog, DialogContent, IconButton, Popover, Tooltip, useTheme } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import { AppContext } from "../../context/main";
import Blinker from "../helpers/Blinker";

export default function NodeBlock() {

  const theme = useTheme();

  const { workspace } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const [nodeStatus, setNodeStatus] = useState(true)

  const [data, setData] = useState({
    clusterStatus: true,
    currentEpoch: 0,
    currentBlock: 0,
    txCount: 0,
  })

  const handleNodeClick = () => {
    setOpen(true);
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

  // Dialog
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        id="cluster-button"
        startIcon={
          workspace?.validatorStatus
          ?
          <PlayArrowIcon color="success" />
          :
          <StopIcon color="error" />
        }
        endIcon={<ExpandMoreIcon />}
        aria-controls={open ? 'cluster-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleNodeClick}
        color="secondary"
      >
        Test Validator
      </Button>

      {/* <Tooltip title="Click to show details" arrow placement="bottom" >
        <Box
          onClick={handleNodeClick}
          sx={{ cursor: 'pointer', mr: '10px' }}
        >
          <Box display={'inline-block'}>
            <span>Cluster</span>
            {workspace?.validatorStatus ?
              <Box component={'span'}><Blinker color='success' />DEVNET</Box>
              :
              <Box component={'span'} color={theme.palette.secondary.main}><Blinker color='error' />STOPPED</Box>
            }
          </Box>
          <ExpandMoreIcon fontSize='medium' />
        </Box>
      </Tooltip>

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
      </Tooltip> */}

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent >
          <Box>
            <Box>
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
            </Box>

            <Box>

            </Box>
          </Box>
        </DialogContent>

      </Dialog>
    </>
  )

}