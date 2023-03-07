import React, { useContext, useState } from "react"
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, FormControl, IconButton, Input, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Tooltip, useTheme } from "@mui/material"
import { TAccount } from "../../libs/types"
import { Keypair } from "@solana/web3.js";
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { minimizeStr } from "../../utils/helper";
import { NavLink } from "react-router-dom";

interface AccountItemProps {
  index: number,
  account: TAccount,
}

export default function KeyItem(props: AccountItemProps) {

  const { index, account } = props;

  const { workspace, setWorkspace } = useContext(AppContext);
  const theme = useTheme();

  const [alias, setAlias] = useState(account.alias);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleEditAliaslick = (event: React.MouseEvent<SVGSVGElement>, value: Keypair) => {
    setDialogOpen(true);
  }

  const handleEsc = (event: any) => {
    if (event.key === "Escape") {
      setDialogOpen(false);
    }
  };

  const handleAliasSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialogOpen(false);

    if (workspace?.accounts && alias !== "") {
      let newWorkspace = Object.assign(Object.create(Object.getPrototypeOf(workspace)), workspace);
      newWorkspace.accounts[index].alias = alias;
      setWorkspace(newWorkspace);
    }
  }

  return (

    <>

      <Box>
        <Box className={account.alias ? 'active' : ''}>
          {/* <PersonOutlineIcon fontSize="inherit" sx={{ mb: '-2px' }} /> */}
          {account.alias ?
            <>
              {`#${index + 1}:`}
              <Box component={'span'} color={theme.palette.primary.main} fontWeight='700' >{account.alias}</Box>
            </>
            :
            `Account Program #${index + 1}`
          }
          <Tooltip title="Edit alias" arrow placement="right" >
            <EditIcon className="edit-btn" onClick={(event) => handleEditAliaslick(event, account.keypair)} fontSize="inherit" sx={{ cursor: "pointer", ml: '5px' }} />
          </Tooltip>
        </Box>
        <Box>
          <Link 
          component={NavLink} 
          to={`/accounts/${account.keypair.publicKey.toString()}`}
          color={theme.palette.text.primary}
          >
            {account.keypair.publicKey.toString()}
          </Link>
          <CopyToClipboard textToCopy={account.keypair.publicKey.toString()} notification='snackbar' />
        </Box>

      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >

        <DialogContent >
          <form onSubmit={handleAliasSubmit} autoComplete="off" >
            {/* <TextField 
        id="account-alias"
        label="Account alias"
        helperText="helper text here"
        variant="outlined"
        fullWidth
        /> */}
            <FormControl fullWidth variant="outlined" size="small" >
              <InputLabel
                sx={{ color: 'text.secondary' }}
                htmlFor="alias-input"
              >
                {alias.length > 0
                  ? `Edit alias for account #${index + 1} (${minimizeStr(account.keypair.publicKey.toString(), 4, 4)}) `
                  : `Create alias for account #${index + 1} (${minimizeStr(account.keypair.publicKey.toString(), 4, 4)})`
                }
              </InputLabel>
              <Input
                id="alias-input"
                value={alias}
                placeholder={alias.length > 0
                  ? `Edit alias for account #${index + 1} (${minimizeStr(account.keypair.publicKey.toString(), 4, 4)}) `
                  : `Create alias for account #${index + 1} (${minimizeStr(account.keypair.publicKey.toString(), 4, 4)})`
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton type="submit" disableRipple >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(event) => setAlias(event.target.value)}
                onKeyUp={handleEsc}
                aria-describedby="alias-helper-text"
              />

            </FormControl>
          </form>

        </DialogContent>

      </Dialog>
    </>
  )

}