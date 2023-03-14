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

  const accounts = workspace?.accountsAsArray;

  const [open, setOpen] = useState(false);

  const openFilterHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    setOpen(true);
  }

  // Dialog
  const handleDialogClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
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
    let newChecked: string[] = [];
    Object.keys(workspace?.accounts!).forEach((key, index) => newChecked.push(key))
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
                {workspace?.accounts && Object.keys(workspace.accounts).map((key, index) => (
                  <ListItem
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        size="small"
                        color="primary"
                        onChange={handleToggle(key)}
                        checked={checked.indexOf(key) !== -1}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    }
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>

                    <ListItemText
                      primary={workspace.accounts![key].alias ? `#${index} ${workspace.accounts![key].alias}` : `Account #${index}`}
                      secondary={key}
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