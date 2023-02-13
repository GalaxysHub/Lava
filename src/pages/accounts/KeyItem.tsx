import React, { useContext, useState } from "react"
import { AppContext } from "../../context/main";
import { Box, Dialog, DialogContent, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField, Tooltip, useTheme } from "@mui/material"
import { TAccount } from "../../libs/types"
import { Keypair } from "@solana/web3.js";
import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { CopyToClipboard } from "../../components/helpers/CopyToClipBoard";
import { minimizeStr } from "../../utils/helper";


export default function KeyItem(item: TAccount) {

  const { accounts, setAccounts } = useContext(AppContext);

  const [alias, setAlias] = useState(item.alias);

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

    if (accounts && alias !== "") {
      let temp = [...accounts];
      temp[item.index - 1].alias = alias;
      setAccounts(temp);
    }
  }

  const theme = useTheme();

  return (

    <>

      <Box>
        {item.alias
          ?
          <>
            <Box className="active">
              {/* <PersonOutlineIcon fontSize="inherit" sx={{ mb: '-2px' }} /> */}
              {`#${item.index}:`}
              <Box component={'span'} color={theme.palette.primary.dark} fontWeight='700' >{item.alias}</Box>
              <Tooltip title="Edit alias" arrow placement="right" >
                <EditIcon className="edit-btn" onClick={(event) => handleEditAliaslick(event, item.keypair)} fontSize="inherit" sx={{ cursor: "pointer", ml: '5px' }} />
              </Tooltip>
            </Box>
            <Box>
              {item.keypair.publicKey.toString()}
              <Tooltip title="Copy Public key" arrow placement="right" >
                <CopyToClipboard textToCopy={item.keypair.publicKey.toString()} notification='snackbar' />
              </Tooltip>
            </Box>
          </>
          :
          <>
            <Box>
              {/* <PersonOutlineIcon fontSize="inherit" sx={{ mb: '-2px' }} /> */}
              {`Account #${item.index}`}
              <Tooltip title="Edit alias" arrow placement="right" >
                <EditIcon className="edit-btn" onClick={(event) => handleEditAliaslick(event, item.keypair)} fontSize="inherit" sx={{ cursor: "pointer", ml: '5px' }} />
              </Tooltip>
            </Box>
            <Box>
              {item.keypair.publicKey.toString()}
              <Tooltip title="Copy Public key" arrow placement="right" >
                <CopyToClipboard textToCopy={item.keypair.publicKey.toString()} notification='snackbar' />
              </Tooltip>
            </Box>
          </>
        }

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
                  ? `Edit alias for account #${item.index} (${minimizeStr(item.keypair.publicKey.toString(), 4, 4)}) `
                  : `Create alias for account #${item.index} (${minimizeStr(item.keypair.publicKey.toString(), 4, 4)})`
                }
              </InputLabel>
              <Input
                id="alias-input"
                value={alias}
                placeholder={alias.length > 0
                  ? `Edit alias for account #${item.index} (${minimizeStr(item.keypair.publicKey.toString(), 4, 4)}) `
                  : `Create alias for account #${item.index} (${minimizeStr(item.keypair.publicKey.toString(), 4, 4)})`
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