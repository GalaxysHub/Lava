import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Link, List, ListItem, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select, Tooltip, Typography, useTheme } from '@mui/material';
import { AppContext } from "../../context/main";
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { TAccount } from "../../libs/types";
import { PublicKey } from "@solana/web3.js";

export default function TransactionsFilter() {

  const { workspace, setWorkspace } = useContext(AppContext);

  const accounts = workspace?.accounts;

  const [open, setOpen] = useState(false);

  const openFilterHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    setOpen(true);
  }

  // Dialog
  const handleDialogClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = React.useState<number[]>([]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleApply = () => {

  }

  const handleSelectAll = () => {
    let newChecked: number[] = [];
    accounts?.forEach(item => newChecked.push(item.index))
    setChecked(newChecked);
  }

  const handleClearAll = () => {
    setChecked([]);
  }

  useEffect(() => {
    console.log(checked)
  }, [checked]);

  return (
    <>
      <Box mb={'10px'} className="filter-bar">
        <Link
          href="#"
          onClick={openFilterHandle}
          color="primary.main"
        >
          <FilterListIcon color="primary" />
          Filter:
        </Link>

      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            Accounts to fetch
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            size='small'
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box>
            <Box>
              <List
                dense
                component="nav"
                sx={{ maxHeight: '70vh' }}
              >
                {workspace?.accounts && workspace?.accounts.map(item => (
                  <ListItem
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        size="small"
                        color="primary"
                        onChange={handleToggle(item.index)}
                        checked={checked.indexOf(item.index) !== -1}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    }
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>

                    <ListItemText
                      primary={item.alias ? `#${item.index} ${item.alias}` : `Account #${item.index}`}
                      secondary={item.keypair.publicKey.toString()}
                    />

                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>

            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ m: 0, px: 3, py: 1.5, justifyContent: 'space-between' }}>
          <Button
            variant='outlined'
            onClick={handleApply}
          >
            Apply
          </Button>
          
          <Box>
            <Button
              size="small"
              onClick={handleClearAll}
            >
              CLEAR
            </Button>

            <Button
              size="small"
              onClick={handleSelectAll}
            >
              SELECT ALL
            </Button>

          </Box>

        </DialogActions>

      </Dialog>
    </>
  )

}