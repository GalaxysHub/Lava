import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, TextField, Typography, useTheme } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { formatBytes } from "../../utils/helper";
import { BpfLoader, BPF_LOADER_PROGRAM_ID, Connection, Keypair } from "@solana/web3.js";
import { AppContext } from "../../context/main";
import { Buffer } from "buffer";
import { TProgram } from "../../libs/types";
import { Workspace } from "../../libs";


export default function DeployProgram() {

  const { workspace, setWorkspace } = useContext(AppContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [radioValue, setRadioValue] = React.useState('local');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose File');

  const inputRef = React.useRef<HTMLInputElement>(null);
  const clearInputValue = () => {
    const inputEl = inputRef.current
    if (inputEl) {
      inputEl.value = ''
    }
  }

  const [selectedFile, setSelectedFile] = React.useState<File | null | undefined>(null)
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.item(0))
  }
  const handleFileClear = () => {
    clearInputValue();
    setSelectedFile(null)
  }

  const deployProgram = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setOpen(true);

  }

  // Dialog
  const handleDialogClose = () => {
    clearInputValue();
    setSelectedFile(null)
    setOpen(false);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmitDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //TODO
    setLoading(true);

    if (workspace && selectedFile && workspace.accounts) {
      const connection = new Connection(workspace.RPC, "confirmed");
      // const payer = workspace.mint;
      const payer = workspace.accounts[0].keypair;
      const programAccount = Keypair.generate();

      selectedFile.arrayBuffer().then(buffer => {
        BpfLoader.load(connection, payer, programAccount, Buffer.from(buffer), BPF_LOADER_PROGRAM_ID)
          .then(result => {
            // console.log(result);
            setLoading(false);
            if (result) {
              //Add new program to Workspace object
              let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
              newWorkspace.programs?.push(
                {
                  alias: '',
                  account: programAccount,
                  initialTxs: []
                }
              );
              setWorkspace(newWorkspace);
              console.log(newWorkspace);

              handleDialogClose();
            }
          })
      })
    }
  };

  return (
    <>

      <Button
        onClick={deployProgram}
        variant="contained"
        startIcon={<PostAddIcon />}
      >
        Deploy Program
      </Button>

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
            DEPLOY PROGRAM
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
              <form onSubmit={handleSubmitDeploy}>
                <FormControl error={error} variant="standard" fullWidth>

                  {/* <FormLabel id="deploy-type">Deploy type</FormLabel> */}

                  <RadioGroup
                    row
                    aria-labelledby="error-deploy"
                    name="deploy"
                    value={radioValue}
                    onChange={handleRadioChange}
                    defaultValue="local"
                  >
                    <FormControlLabel value="local" control={<Radio size="small" />} label="From local machine" />
                    <FormControlLabel value="clone" control={<Radio size="small" />} label="Clone from cluster" />
                  </RadioGroup>

                  <Box minHeight={'200px'}>
                    {radioValue === 'local'
                      ?
                      <>
                        <FormHelperText>{helperText}</FormHelperText>

                        <FormGroup row sx={{ my: '15px' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            disableElevation
                            size="small"
                            startIcon={<FileUploadIcon />}
                            sx={{ mr: '10px' }}>
                            Select file
                            <input
                              // accept="image/*"
                              hidden
                              type="file"
                              ref={inputRef}
                              onChange={handleFileSelect}
                            />
                          </Button>
                          <FormHelperText>{selectedFile ? `${selectedFile.name} (${formatBytes(selectedFile.size)})` : 'no file selected'}</FormHelperText>

                          {(selectedFile as File)?.name !== undefined && (
                            <IconButton
                              aria-label="clear-file"
                              onClick={handleFileClear}
                              size='small'
                              sx={{
                                color: (theme) => theme.palette.secondary.dark,
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
                        </FormGroup>
                      </>
                      :
                      <>
                        <br></br>
                        Not yet inmplemented
                      </>
                    }
                  </Box>

                  <LoadingButton
                    sx={{ mt: 1, mr: 1 }}
                    type="submit"
                    variant="contained"
                    disabled={(selectedFile as File)?.name === undefined}
                    loading={loading}
                    loadingPosition={loading ? 'center' : 'start'}
                  // startIcon={<SaveIcon />}
                  >
                    <span>Deploy</span>
                  </LoadingButton>

                </FormControl>
              </form>
            </Box>

            <Box>

            </Box>
          </Box>
        </DialogContent>

      </Dialog>

    </>
  )

}