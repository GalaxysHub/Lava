import React, { useContext, useState } from "react"
import { Box, Button, Menu, MenuItem, Tooltip, useTheme } from "@mui/material"
import { AppContext } from "../../context/main";
import Fade from '@mui/material/Fade';
import RepeatIcon from '@mui/icons-material/Repeat';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ClusterSelect() {

  const theme = useTheme();

  const { workspace, setWorkspace } = useContext(AppContext);

  const [cluster, setCluster] = useState(workspace?.cluster.name!)

  const [data, setData] = useState()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateWorkspaceCluster = (
    cluster: 'localnet' | 'testnet' | 'devnet' | 'mainnet-beta',
    endpoint = 'http://localhost:8899'
  ) => {
    if (workspace) {
      let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
      newWorkspace.cluster = {
        name: cluster,
        endpoint: endpoint,
      }
      setWorkspace(newWorkspace);
      setCluster(cluster);
    }

  }

  const handleLocalnet = () => {
    updateWorkspaceCluster('localnet', workspace?.validator.RpcUrl!);
    handleClose();
  }

  const handleDevnet = () => {
    updateWorkspaceCluster('devnet', 'https://api.devnet.solana.com');
    handleClose();
  }

  const handleTestnet = () => {
    updateWorkspaceCluster('testnet', 'https://api.testnet.solana.com');
    handleClose();
  }

  const handleMainnet = () => {
    updateWorkspaceCluster('mainnet-beta', 'https://api.mainnet-beta.solana.com');
    handleClose();
  }

  return (
    <div>
      <Button
        id="cluster-button"
        startIcon={<RssFeedIcon color="success"/>}
        endIcon={<KeyboardArrowDownIcon />}
        aria-controls={open ? 'cluster-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="secondary"
      >
        {cluster}
      </Button>
      <Menu
        id="cluster-menu"
        MenuListProps={{
          'aria-labelledby': 'cluster-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleLocalnet}>Localnet</MenuItem>
        <MenuItem onClick={handleDevnet}>Devnet</MenuItem>
        <MenuItem onClick={handleTestnet}>Testnet</MenuItem>
        <MenuItem onClick={handleMainnet}>Mainnet Beta</MenuItem>
      </Menu>
    </div>
  );

}