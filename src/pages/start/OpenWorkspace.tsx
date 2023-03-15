import React, { useContext, useState } from "react"
import { Avatar, Box, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NewWorkspaceLoader from "../../components/loader/NewWorkspaceLoader"
import { Validator, Workspace } from "../../libs"


const dummyData = [
  {index: 1, created: '11/03/21 15:00 UTC'},
  {index: 2, created: '12/03/21 12:10 UTC'},
  {index: 3, created: '12/03/21 23:41 UTC'},
  // {index: 4, created: '14/03/21 09:44 UTC'},
]

export default function OpenWorkspace() {

  const theme = useTheme();
  const navigate = useNavigate();
  const { setWorkspace } = useContext(AppContext);

  const [start, setStart] = useState(false);

  const [data, setData] = useState([1, 2, 3]);

  const openWorkspaceHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    setStart(true);

    // const validator = new Validator();
    // const workspace = new Workspace(validator);
    // workspace.initialAirdrop();

    // setWorkspace(workspace);

    // setTimeout(() => { navigate('/accounts/') }, 3000);
  }

  // Dialog
  const handleDialogClose = () => {
    setStart(false);
  };


  return (
    <>
      <Box>
        <Button
          onClick={openWorkspaceHandle}
          fullWidth
          variant="contained"
          size="large"
        >
          OPEN EXISTING WORKSPACE
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='xs'
        open={start}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >

        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            Open Existing Workspace
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
        
        <DialogContent >
          <Box>
            <Box>
              <List
                dense
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                {dummyData.map(item => (
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemButton>
                      {/* <ListItemIcon>
                        <FolderIcon color="primary"/>
                      </ListItemIcon> */}
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon color="primary" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Workspace #${item.index}`}
                        secondary={`created: ${item.created}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>

            </Box>
          </Box>
        </DialogContent>

      </Dialog>
    </>
  )

}