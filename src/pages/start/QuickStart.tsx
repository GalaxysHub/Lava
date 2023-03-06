import React, { useContext, useState } from "react"
import { Box, Dialog, DialogContent, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";
import NewWorkspaceLoader from "../../components/loader/NewWorkspaceLoader"
import { Validator, Workspace } from "../../libs"
import * as web3 from "@solana/web3.js";
import { invoke } from "@tauri-apps/api";
import { InvokeResponse } from "../../libs/types";

export default function QuickStart() {

  const theme = useTheme();
  const navigate = useNavigate();

  const { setWorkspace } = useContext(AppContext);
  const [start, setStart] = useState(false);
  const [rpc, setRPC] = useState("");

  const quickStartHandle = async (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setStart(true);
    let validator = new Validator();
    let workspace = new Workspace(validator, []);
    // setWorkspace(workspace);
    const result: InvokeResponse = JSON.parse(await invoke<string>('start_validator', { pk: Array.from(workspace.mint.secretKey) }));
    validator.setRpc(result.result.rpc_url);
    workspace.setValidator(validator);
    workspace.initialAirdrop();
    setWorkspace(workspace);
    navigate('/accounts/');
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