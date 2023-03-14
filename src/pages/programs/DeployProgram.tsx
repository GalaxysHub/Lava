import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, TextField, Typography, useTheme } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { formatBytes } from "../../utils/helper";
import { BpfLoader, BPF_LOADER_PROGRAM_ID, Connection, Keypair } from "@solana/web3.js";
import { AppContext } from "../../context/main";
import { Buffer } from "buffer";
import { Idl } from '@project-serum/anchor';


export default function DeployProgram() {

  const { workspace, setWorkspace } = useContext(AppContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [radioValue, setRadioValue] = React.useState('local');

  const [error, setError] = React.useState(false);

  const inputRefProgram = React.useRef<HTMLInputElement>(null);
  const inputRefIdl = React.useRef<HTMLInputElement>(null);

  const [parsedIdl, setPasedIdl] = useState<Idl>();

  const clearProgramInputValue = () => {
    const inputEl = inputRefProgram.current
    if (inputEl) {
      inputEl.value = ''
    }
  }

  const clearIdlInputValue = () => {
    const inputEl = inputRefIdl.current
    if (inputEl) {
      inputEl.value = ''
    }
  }

  const [selectedProgramFile, setSelectedProgramFile] = React.useState<File | null | undefined>(null)
  const handleProgramFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedProgramFile(event.target.files?.item(0))
  }
  const handleProgramFileClear = () => {
    clearProgramInputValue();
    setSelectedProgramFile(null)
  }

  const [selectedIdlFile, setSelectedIdlFile] = React.useState<File | null | undefined>(null)
  const handleIdlFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files?.item(0)!, "UTF-8");
    fileReader.onload = e => {
      // console.log("e.target.result", e.target?.result);
      // console.log(JSON.parse(fileReader?.result?.toString()!));
      setPasedIdl(JSON.parse(fileReader?.result?.toString()!));
    };
    // TODO - Check
    setSelectedIdlFile(event.target.files?.item(0))
  }
  const handleIdlFileClear = () => {
    clearIdlInputValue();
    setSelectedIdlFile(null)
  }

  const addProgram = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setOpen(true);
  }

  // Dialog
  const handleDialogClose = () => {
    clearProgramInputValue();
    clearIdlInputValue();
    setSelectedProgramFile(null)
    setSelectedIdlFile(null)
    setOpen(false);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
    setError(false);
  };

  const handleSubmitDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //TODO
    setLoading(true);

    if (workspace && selectedProgramFile && workspace.accounts) {
      const connection = new Connection(workspace.RPC, "confirmed");
      const payer = workspace.mainWallet?.keypair!;
      const programAccount = Keypair.generate();

      selectedProgramFile.arrayBuffer().then(buffer => {
        BpfLoader.load(connection, payer, programAccount, Buffer.from(buffer), BPF_LOADER_PROGRAM_ID)
          .then(result => {
            // console.log(result);
            setLoading(false);
            if (result) {
              //Add new program to Workspace object
              let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
              newWorkspace.programs[programAccount.publicKey.toString()] =
              {
                alias: `${parsedIdl?.name ? parsedIdl?.name : ''}`,
                pubkey: programAccount.publicKey,
                account: programAccount,
                cluster: workspace?.cluster,
                size: buffer.byteLength,
                idl: (parsedIdl?.name !== undefined) ? parsedIdl : {},
                initialTxs: [],
                pdas: {},
              }

              setWorkspace(newWorkspace);
              // console.log(newWorkspace);

              handleDialogClose();
            }
          })
      })
    }
  };

  return (
    <>

      <Fab
        color="primary"
        aria-label="Add program"
        onClick={addProgram}
      >
        <AddIcon />
      </Fab>

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
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <FormControlLabel value="local" control={<Radio size="small" />} label="From local machine" />
                    <FormControlLabel value="clone" control={<Radio size="small" />} label="Clone from cluster" />
                  </RadioGroup>

                  <Box minHeight={'200px'}>
                    {radioValue === 'local'
                      ?
                      <Box textAlign={'center'}>

                        <FormGroup row sx={{ my: '25px', display: 'block', justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            disableElevation
                            size="small"
                            startIcon={<FileUploadIcon />}
                            sx={{ mr: '10px' }}>
                            Select .so file
                            <input
                              // accept="image/*"
                              hidden
                              type="file"
                              ref={inputRefProgram}
                              onChange={handleProgramFileSelect}
                            />
                          </Button>
                          <FormHelperText sx={{ textAlign: 'center' }}>
                            {selectedProgramFile ? `${selectedProgramFile.name} (${formatBytes(selectedProgramFile.size)})` : 'no file selected'}
                          </FormHelperText>

                          {/* {(selectedProgramFile as File)?.name !== undefined && (
                            <IconButton
                              aria-label="clear-file"
                              onClick={handleProgramFileClear}
                              size='small'
                              sx={{
                                color: (theme) => theme.palette.secondary.dark,
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          )} */}
                        </FormGroup>

                        <FormGroup row sx={{ my: '25px', display: 'block', justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            disableElevation
                            size="small"
                            startIcon={<FileUploadIcon />}
                            sx={{ mr: '10px' }}>
                            Select IDL file
                            <input
                              // accept="image/*"
                              hidden
                              type="file"
                              ref={inputRefIdl}
                              onChange={handleIdlFileSelect}
                            />
                          </Button>
                          <FormHelperText sx={{ textAlign: 'center' }}>
                            {selectedIdlFile ? `${selectedIdlFile.name} (${formatBytes(selectedIdlFile.size)})` : 'no file selected'}
                          </FormHelperText>

                          {/* {(selectedIdlFile as File)?.name !== undefined && (
                            <IconButton
                              aria-label="clear-file"
                              onClick={handleIdlFileClear}
                              size='small'
                              sx={{
                                color: (theme) => theme.palette.secondary.dark,
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          )} */}
                        </FormGroup>
                      </Box>
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
                    disabled={(selectedProgramFile as File)?.name === undefined}
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