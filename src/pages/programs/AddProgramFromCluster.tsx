import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Input, Radio, RadioGroup, Skeleton, TextField, Typography, useTheme } from "@mui/material"
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { formatBytes } from "../../utils/helper";
import { AppContext } from "../../context/main";
import { AccountInfo, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Idl } from '@project-serum/anchor';
import { decodeIdlAccount } from '@project-serum/anchor/dist/cjs/idl';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { inflate } from "pako";


interface Program {
  pubkey: PublicKey;
  accountInfo: AccountInfo<Buffer> | null;
  idl?: {};
}

export default function AddProgramFromCluster() {

  const { workspace, setWorkspace } = useContext(AppContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [fetching, setSetFetching] = useState(false);

  const [open, setOpen] = useState(false);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const [inputStr, setInputStr] = useState('');
  const [parsedIdl, setPasedIdl] = useState<Idl>();
  const [program, setProgram] = useState<Program>();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const clearInputValue = () => {
    const inputEl = inputRef.current
    if (inputEl) {
      inputEl.value = ''
    }
  }

  const [selectedFile, setSelectedFile] = React.useState<File | null | undefined>(null)
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    // setSelectedFile(event.target.files?.item(0));
    // const fileReader = new FileReader();
    // fileReader.readAsText(event.target.files?.item(0)!, "UTF-8");
    // fileReader.onload = e => {
    //   console.log("e.target.result", e.target?.result);
    //   console.log(JSON.parse(fileReader?.result?.toString()!));
    //   setPasedIdl(JSON.parse(fileReader?.result?.toString()!));
    // };
  }
  const handleFileClear = () => {
    clearInputValue();
    setSelectedFile(null)
  }

  const addProgram = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setOpen(true)
  }

  // Dialog
  const handleDialogClose = () => {
    clearInputValue();
    setSelectedFile(null)
    setOpen(false);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event?.key === "Enter") {
      handlerSearchProgram();
    }
  }

  const fetchIdl = async (pubkey: PublicKey) => {
    const base = (await PublicKey.findProgramAddress([], pubkey))[0];
    const idlAddress = await PublicKey.createWithSeed(base, "anchor:idl", pubkey);

    const connection = new Connection(workspace?.RPC!, "confirmed");
    const idlAccountInfo = await connection.getAccountInfo(idlAddress);
    const idlAccount = decodeIdlAccount(idlAccountInfo!.data.slice(8)); // chop off discriminator
    const inflatedIdl = inflate(idlAccount.data);
    const idlJson = JSON.parse(utf8.decode(inflatedIdl));
    // console.log(idlJson);
    setPasedIdl(idlJson);
  }

  const handlerSearchProgram = () => {
    setInputStr('');
    setHelperText('');
    setSetFetching(true);
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(inputStr);
    }
    catch (err) {
      return;
    }
    const connection = new Connection(workspace?.RPC!, "confirmed");
    connection.getAccountInfo(pubkey!).then(account => {
      console.log(account);
      if (account?.executable) {
        setProgram({ pubkey: pubkey, accountInfo: account });
        setSetFetching(false);

        fetchIdl(pubkey);
        // console.log(account);
      }
    })
      .catch((error) => {
        setSetFetching(false);
        console.log(error);
      })
      .finally(() => {
        setHelperText('No valid results finded.');
        setSetFetching(false);
      })
  }

  const handleSubmitProgram = () => {
    if (program?.pubkey) {
      let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
      newWorkspace.programs[program.pubkey.toString()] =
      {
        alias: parsedIdl?.name,
        pubkey: program?.pubkey,
        cluster: workspace?.cluster,
        size: (program.accountInfo?.data as Buffer).byteLength,
        idl: parsedIdl,
        initialTxs: [],
        pdas: {},
      }

      setWorkspace(newWorkspace);
      // console.log(newWorkspace);
      handleDialogClose();
    }
  }

  // useEffect(() => {
  //   console.log('parsedIDL: ',parsedIdl);
  // }, [parsedIdl]);

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
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            Add Program from {String(workspace?.cluster.name).toUpperCase()} Cluster
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

            <Box
              // minHeight={'200px'}
              // bgcolor={theme.palette.secondary.dark}
              borderRadius={1}
              border={`1px solid ${theme.palette.divider}`}
            >
              <Box px={2} py={1}>
                {!program?.accountInfo ?
                  <Box
                    display={'flex'}
                    minHeight={'150px'}
                  >
                    <Box
                      margin={'auto'}
                      textTransform={'uppercase'}
                      fontSize={'0.75rem'}
                      color={theme.palette.secondary.main}
                    >
                      {fetching ?
                        <Box sx={{ display: 'flex' }}>
                          <CircularProgress />
                        </Box>
                        :
                        <>{helperText ? helperText : 'Program not selected'}</>
                      }
                    </Box>
                  </Box>
                  :
                  <>
                    <Box display={'flex'} justifyContent={'space-between'} my={0.5}>
                      <Box
                        textTransform={'uppercase'}
                        fontSize={'0.85rem'}
                        color={theme.palette.secondary.main}
                      >
                        Program ID:
                      </Box>
                      <Box fontSize={'0.85rem'}>{program.pubkey.toString()}</Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} my={0.5}>
                      <Box
                        textTransform={'uppercase'}
                        fontSize={'0.85rem'}
                        color={theme.palette.secondary.main}
                      >
                        Name:
                      </Box>
                      <Box fontSize={'0.8rem'} textTransform={'uppercase'}>{parsedIdl?.name}</Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} my={0.5}>
                      <Box
                        textTransform={'uppercase'}
                        fontSize={'0.85rem'}
                        color={theme.palette.secondary.main}
                      >
                        Version:
                      </Box>
                      <Box fontSize={'0.85rem'}>{parsedIdl?.version}</Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} my={0.5}>
                      <Box
                        textTransform={'uppercase'}
                        fontSize={'0.85rem'}
                        color={theme.palette.primary.main}
                        mt={0.5}
                      >
                        Instructions:
                      </Box>
                      <Box fontSize={'0.85rem'}>
                        {/* <input
                          accept="application/json"
                          // hidden
                          type="file"
                          ref={inputRef}
                          onChange={handleFileSelect}
                        /> */}
                        {parsedIdl?.instructions.length}
                      </Box>
                    </Box>
                  </>
                }
              </Box>
            </Box>

            <Box width={'100%'} mt={5} mb={2}>

              {/* {(selectedFile as File)?.name !== undefined && (
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
              )} */}

              <Box
                sx={{
                  // mr: '10px',
                  p: '0px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px'
                }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="menu" size="small">
                  <MenuIcon fontSize="small" />
                </IconButton>

                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: '0.85rem' }}
                  placeholder="Paste Program Account Public Key"
                  inputProps={{ 'aria-label': 'Program Account Public Key' }}
                  onChange={(event) => setInputStr(event.target.value)}
                  onKeyUp={handleEnter}
                  value={inputStr}
                />

                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                <IconButton
                  color="primary"
                  sx={{ p: '10px' }}
                  aria-label="Apply"
                  size="small"
                  onClick={handlerSearchProgram}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <LoadingButton
              sx={{ mt: 1, mr: 1 }}
              variant="contained"
              disabled={(parsedIdl?.name === undefined)}
              loading={loading}
              loadingPosition={loading ? 'center' : 'start'}
              // startIcon={<SaveIcon />}
              fullWidth
              onClick={handleSubmitProgram}
            >
              <span>Add</span>
            </LoadingButton>

            <Box>

            </Box>
          </Box>
        </DialogContent>

      </Dialog>

    </>
  )

}