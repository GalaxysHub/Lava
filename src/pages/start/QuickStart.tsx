import React, { useContext, useState } from "react"
import { Box, Dialog, DialogContent, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";
import NewWorkspaceLoader from "../../components/loader/NewWorkspaceLoader"
import { Validator, Workspace } from "../../libs"

export default function QuickStart() {

  const theme = useTheme();
  const navigate = useNavigate();

  const { setWorkspace } = useContext(AppContext);
  const [start, setStart] = useState(false);

  const quickStartHandle = async (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setStart(true);

    const validator = new Validator();
    const workspace = new Workspace(validator, {});
    workspace.initialAirdrop();

    setWorkspace(workspace);

    setTimeout(() => { navigate('/accounts/') }, 3000);
  }

  // Dialog
  const handleDialogClose = () => {
    setStart(false);
  };


  return (
    <>
      <Box>
        <Button
          onClick={quickStartHandle}
          fullWidth
          variant="contained"
          size="large"
        >
          QUICK START
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='xs'
        open={start}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent >
          <NewWorkspaceLoader />
        </DialogContent>

      </Dialog>
    </>
  )

}