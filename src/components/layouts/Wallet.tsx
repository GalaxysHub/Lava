import React, { useContext, useState } from "react"
import { Box, Button, Divider, FormControl, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Popover, Select, SwipeableDrawer, Tooltip, useTheme } from "@mui/material"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { AppContext } from "../../context/main";
import { TAccount } from "../../libs/types";

export default function Wallet() {

  const { workspace } = useContext(AppContext);
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(open);
    };

  const [sender, setSender] = useState<TAccount>();
  const [receiver, setReceiver] = useState<TAccount>();

  const handleSenderChange = () => {

  }

  const handleReceiverChange = () => {

  }

  return (
    <>
      <IconButton onClick={toggleDrawer(!open)} color='primary'>
        <AccountBalanceWalletIcon fontSize="medium" />
      </IconButton>

      <SwipeableDrawer
        hideBackdrop
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{ sx: { backgroundColor: `#333` } }}
      >
        <Box
          minWidth={'500px'}
          height={'100%'}
          pt={'70px'}
          pl={'80px'}
          pr={2}
        >
          <Box display={'flex'} justifyContent={'end'}>
            <Box
              textAlign={'right'}
              textTransform={'uppercase'}
              fontSize={'1.1rem'}
              fontWeight={700}
              mt={0.4}
              mr={2}
              color={theme.palette.secondary.main}
            >
              <AccountBalanceWalletIcon fontSize="inherit" sx={{ mb: -0.3 }} /> Lava Wallet
            </Box>
            <Box>
              <Tooltip title="Close Wallet" arrow placement="right" >
                <IconButton color='secondary' size="small" onClick={toggleDrawer(false)}>
                  <KeyboardArrowLeftIcon fontSize="medium" sx={{ fontSize: '1.4rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box mt={2}>
            <FormControl size="small" fullWidth sx={{ my: 1.5 }}>
              <InputLabel id="select-small-sender">Age</InputLabel>
              <Select
                labelId="select-small-sender"
                id="select-small-sender"
                value={sender}
                label="Sender"
                onChange={handleSenderChange}
              >
                {/* {Object.keys(workspace?.accounts!).forEach((key, index) => (
                  <MenuItem value={key}>Key</MenuItem>
                ))} */}

              </Select>
            </FormControl>

            <FormControl size="small" fullWidth
              sx={{
                my: 1.5,
                // backgroundColor: `${theme.palette.secondary.main}`,
                color: `${theme.palette.text.primary}`
              }}>
              <InputLabel id="select-small-receiver">Age</InputLabel>
              <Select
                labelId="select-small-receiver"
                id="select-small-receiver"
                value={receiver}
                label="Sender"
                onChange={handleReceiverChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
              SEND AMOUNT
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )

}