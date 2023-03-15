import React, { useEffect } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import ConstructionIcon from '@mui/icons-material/Construction';
import { AppContext } from "../../context/main";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { IdlAccountItem, IdlInstruction } from "@project-serum/anchor/dist/cjs/idl";
import { TAccount } from "../../libs/types";
import { Workspace } from "../../libs";
import { SelectChangeEvent } from '@mui/material/Select';

interface InstructionAccount {
  instruction: IdlInstruction;
  account: IdlAccountItem;
  index: number;
  programID: PublicKey;
}


interface TestInstructionArgument {

}

interface TestInstructionAccount {

}

interface TestInstruction {
  instructionIndex: number,
  accounts: TestInstructionAccount[],
  arguments: TestInstructionArgument[],
}

export default function TestInstructionAccountItem(props: InstructionAccount) {
  const { instruction, account, index, programID } = props;

  const { workspace, setWorkspace } = React.useContext(AppContext);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const helperMenuOpen = Boolean(anchorEl);
  const handleHelperClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleHelperMenuClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);
  const [pdaOpen, setPdaOpen] = React.useState(false);

  const [selectedAccount, setSelectedAccount] = React.useState<PublicKey | [PublicKey, number]>();

  const generateHandler = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, alias: string) => {
    if (workspace?.accounts!) {
      event.preventDefault();
      const account = Keypair.generate();
      setSelectedAccount(account.publicKey);
      //TODO - add account to workspace
      let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);

      // let newWorkspaceAccountRelations:TAcoountProgramRelation[] = [];
      // newWorkspaceAccountRelations.push({
      //   instruction: instruction.name.toString(), 
      //   accountIndex: index,
      // })

      const newWorkspaceAccount: TAccount = {
        alias: alias,
        mnemonic: '',
        keypair: account,
        // relations: {},
        main: false,
      }

      newWorkspace.accounts[account.publicKey.toString()] = newWorkspaceAccount;

      // newWorkspaceAccount.relations![account.publicKey.toString()] = newWorkspaceAccountRelations;

      // newWorkspace.accounts[programID.toString()] = newWorkspaceAccount;
      setWorkspace(newWorkspace);
      console.log(workspace);
    }
  }

  const findPdaHandler = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, alias: string) => {
    event.preventDefault();
    handleHelperMenuClose();
    setPdaOpen(true);
    // const account = PublicKey.findProgramAddressSync();;
    //TODO - add account to workspace
    // setSelectedAccount(pda)
  }

  const selectExistingHandler = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, alias: string) => {
    event.preventDefault();
    setOpen(true);
  }

  const handlerSelectAccount = (event: SelectChangeEvent) => {
    event.preventDefault();
    const pubkeyStr = event.target.value;
    const account = workspace?.accounts![pubkeyStr]!;
    console.log(pubkeyStr);
    setSelectedAccount(account.keypair.publicKey)
  }

  // Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // PDA Dialog
  const handlePdaClose = () => {
    setPdaOpen(false);
  };

  const [seedType, setSeedType] = React.useState('string');
  // const [error, setError] = React.useState(false);
  // const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeedType((event.target as HTMLInputElement).value);
    setSeedInput('');
    // setHelperText(' ');
    // setError(false);
  };

  const [seeds, setSeeds] = React.useState<string[]>([]);
  const [seedInput, setSeedInput] = React.useState<string>('');

  const handleAddSeed = () => {
    if (seedInput && seedInput !== '') {
      setSeeds(oldData => [...oldData, seedInput]);
    }
    // const decoded = bs58.decode(seedInput);
    // if (decoded.length !== 32) {
    //   setSeedInput('');
    // }
    setSeedInput('');
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event?.key === "Enter") {
      handleAddSeed();
    }
  }

  const handleDeleteSeed = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    if (seeds.length === 1 && index === 0) {
      setSeeds([]);
    } else {
      const newSeeds = [...seeds];
      newSeeds.splice(index, 1);
      setSeeds(newSeeds);
    }
  }

  const findPdaAndPaste = () => {
    console.log(programID);
    const pdaSeeds = seeds.map(item => Buffer.from(item, 'utf-8'));
    const [pdaPubkey, pdaBump] = PublicKey.findProgramAddressSync(pdaSeeds, programID);
    const pda = PublicKey.findProgramAddressSync(pdaSeeds, programID);
    console.log(pda);
    // Add new program to Workspace object
    let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
    newWorkspace.programs[programID.toString()].pdas[pdaPubkey.toString()] = [pdaPubkey, pdaBump];
    setWorkspace(newWorkspace);
    console.log(workspace);

    // const x = workspace?.programs[programID.toString()].tests?.at(0)?.instructions.at(0)?.accounts.at(0);

    setSelectedAccount([pdaPubkey, pdaBump]);
  }

  // const [testInstruction, seTestInstruction] = React.useState<TestInstruction>();

  // useEffect(() => {
  //   // console.log(workspace);
  //   console.log('selectedAccount: ', selectedAccount);
  // }, [selectedAccount]);

  return (
    <>
      <Box
        id={`select-ix-account-item-${index}`}
        mb={2}
      >
        <FormControl
          size="small"
          variant="standard"
          fullWidth
        >
          <Box display={'flex'}>
            <Box width={'100%'}>
              <InputLabel
                id={`select-label-${index}`}
              // sx={{ fontSize: '0.9rem' }}
              >
                {account.name}
              </InputLabel>
              <Select
                fullWidth
                displayEmpty
                // defaultValue={selectedAccount?.toString()}
                labelId={`select-label-${index}`}
                id={`select-${index}`}
                // value={selectedAccount?.toString()}
                label={account.name}
                // onChange={(event) => setSelectedAccount(event.target.value)}
                // onChange={(event) => handlerSelectAccount(event)}
                sx={{
                  color: `${theme.palette.primary.main}`,
                  fontSize: '0.85rem',
                  // maxWidth: '400px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {workspace?.accountsAsArray.map((item, index) => (
                  <MenuItem
                    key={item.alias}
                    value={item.keypair.publicKey.toString()}
                    sx={{ maxWidth: '400px', fontSize: '0.8rem' }}
                  >
                    <Box
                      color={theme.palette.primary.main}
                      display={'contents'}
                    >
                      {item.alias}&nbsp;
                    </Box>
                    <Box
                      color={theme.palette.secondary.main}
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      display={'initial'}
                    >
                      {item.keypair.publicKey.toString()}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Tooltip title={'Actions'}>
                <IconButton
                  sx={{ mt: 2, mr: -1 }}
                  size="small"
                  id="basic-button"
                  aria-controls={helperMenuOpen ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={helperMenuOpen ? 'true' : undefined}
                  onClick={handleHelperClick}
                >
                  <MoreVertIcon
                    fontSize="inherit"
                    color="primary"
                  />
                </IconButton>
              </Tooltip>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={helperMenuOpen}
                onClose={handleHelperMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                // elevation={0}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={(event) => generateHandler(event, account.name)} sx={{ fontSize: '0.7rem' }}>
                  GENERATE & PASTE
                </MenuItem>
                <MenuItem onClick={(event) => findPdaHandler(event, account.name)} sx={{ fontSize: '0.7rem' }}>
                  FIND PDA
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </FormControl>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            Select Account
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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

        </DialogActions>

      </Dialog>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={pdaOpen}
        onClose={handlePdaClose}
        aria-labelledby="responsive-pda-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            Find Program Derived Address
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handlePdaClose}
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
              <Box fontSize={'0.8rem'} color={theme.palette.secondary.main}>SEEDS ARRAY:</Box>
              <List
                dense
                component="nav"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  maxHeight: '70vh',
                  minHeight: '250px'
                }}
              >
                {seeds.map((item, index) => (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ p: 0.5, mr: 0.5 }}
                        onClick={event => handleDeleteSeed(event, index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {bs58.decode(item).length !== 32
                        ?
                        <TextFormatIcon color="primary" fontSize="small" />
                        :
                        <PersonIcon color="primary" fontSize="small" />
                      }
                    </ListItemIcon>

                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        color: `${theme.palette.primary.main}`
                      }}
                      secondaryTypographyProps={{
                        mt: -0.5
                      }}
                      primary={bs58.decode(item).length !== 32 ? 'string' : 'Public Key'}
                      secondary={String(item)}
                    />

                  </ListItem>
                ))}


              </List>
            </Box>

            <Box>

              <Box display={'flex'} mt={2} mb={1}>
                <Box color={theme.palette.primary.main}>
                  Seed type:
                </Box>

                <Box>
                  <FormControl
                    sx={{ mt: -1, ml: 1 }}
                    // error={error} 
                    variant="standard"
                  >
                    {/* <FormLabel id="pda-radios">Sed type:</FormLabel> */}
                    <RadioGroup
                      row
                      aria-labelledby="pda-radios"
                      name="pda"
                      value={seedType}
                      onChange={handleRadioChange}
                      sx={{ display: 'inline-block' }}
                    >
                      <FormControlLabel value="string" control={<Radio size="small" />} label="string" />
                      <FormControlLabel value="pubkey" control={<Radio size="small" />} label="pubkey" />
                    </RadioGroup>
                    {/* <FormHelperText>{helperText}</FormHelperText> */}
                  </FormControl>
                </Box>
              </Box>

              <Box display={'flex'} width={'100%'}>
                {seedType === 'string' && (
                  <FormControl size="small" variant="outlined" fullWidth>
                    <TextField
                      size="small"
                      value={seedInput}
                      label="Seed string"
                      onChange={(event) => setSeedInput(event.target.value)}
                      onKeyUp={handleEnter}
                    // inputProps={{
                    //   fontSize: '0.8rem',
                    // }}
                    >

                    </TextField>
                  </FormControl>
                )}

                {seedType === 'pubkey' && (
                  <FormControl size="small" variant="outlined" fullWidth>
                    <InputLabel
                      id={`select-seed-type-label`}
                    >
                      Account Public Key
                    </InputLabel>
                    <Select
                      labelId={`select-seed-type-label`}
                      id={`select-seed-type`}
                      value={seedInput}
                      label="Account Public Key"
                      sx={{
                        color: `${theme.palette.primary.main}`,
                        fontSize: '0.95rem',
                      }}
                      onChange={(event) => setSeedInput(event.target.value)}
                    >
                      {workspace?.accountsAsArray.map((item, index) => (
                        <MenuItem
                          selected
                          sx={{ maxWidth: '500px', fontSize: '0.8rem' }}
                          value={item.keypair.publicKey.toString()}
                          divider
                        >
                          <Box
                            color={theme.palette.primary.main}
                            display={'contents'}
                          >
                            {`#${index} ${item.alias}:`}
                          </Box>
                          <Box
                            color={theme.palette.secondary.main}
                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                            display={'initial'}
                          >
                            {item.keypair.publicKey.toString()}
                          </Box>
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                )}

                <Button disableElevation onClick={handleAddSeed} variant="outlined" sx={{ maxHeight: '36px', mt: 0.1, ml: 1.5 }}>
                  Add&nbsp;Seed
                </Button>

              </Box>

            </Box>
          </Box>

        </DialogContent>

        <DialogActions sx={{ mb: 1, px: 3, py: 1 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={seeds.length === 0}
            onClick={findPdaAndPaste}
          >
            Find PDA & PASTE
          </Button>
        </DialogActions>

      </Dialog>
    </>
  );
}