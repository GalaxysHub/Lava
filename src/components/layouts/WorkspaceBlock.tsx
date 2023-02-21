import React, { useContext, useState } from "react"
import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Popover, Tooltip } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DvrIcon from '@mui/icons-material/Dvr';
import SaveIcon from '@mui/icons-material/Save';
import { AppContext } from "../../context/main";
import { Logout } from "@mui/icons-material";

export default function WorkspaceBlock() {

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

  return (

    <Box display={"flex"} mr="15px">
      <Tooltip title="Current Workspace" arrow placement="bottom" >
        <Box margin={'auto'}>
          <DvrIcon fontSize="small" sx={{ mb: '-4px' }} /> :
          Workspace Name
        </Box>
      </Tooltip>

      <IconButton
        size='small'
        onClick={handleClick}
        // sx={{ ml: 2 }}
        aria-controls={open ? 'workspace-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <ExpandMoreIcon fontSize='medium' />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="workspace-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          Save
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>

      </Menu>

    </Box>






  )

}