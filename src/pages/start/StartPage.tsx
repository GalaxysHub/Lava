import React, { useContext, useState } from "react"
import { generateKeypairs } from "../../utils/helper"
import { Box, Dialog, DialogContent, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";
import NewWorkspaceLoader from "../../components/loader/NewWorkspaceLoader"
import { TSettings } from "../../libs/types"

export default function StartPage() {
  const navigate = useNavigate();
  const { settings, setSettings, setAccounts } = useContext(AppContext);

  const [start, setStart] = useState(false);

  const quickStartHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
    setStart(true);

    // create settings
    // const newSettings:TSettings = {
    //   validatorHostame: "127.0.0.1",
    //   vaidatorPort: 8899,
    //   keysCount: 10,
    // };
    // setSettings(newSettings);

    // create accounts
    const keys = generateKeypairs(settings.keysCount);
    setAccounts(keys);

    setTimeout(() => { navigate('/accounts/') }, 3000);
  }

  const openWorkspaceHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {

  }

  const createWorkspaceHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {

  }

  // Dialog
  const handleDialogClose = () => {
    setStart(false);
  };

  const theme = useTheme();

  return (
    <>
      <Box id="start-page" bgcolor={theme.palette.primary.light} textAlign={"center"} display="flex" height={"100vh"}>

        {!start
          ?
          <Box margin={"auto"} minWidth="300px">

            <Box component={'span'} fontSize={'3.5rem'} fontWeight="700" letterSpacing={"0.5rem"}>LAVA</Box>
            <br />
            <Box component={'span'} fontSize={'0.8rem'}>SOLANA DEVELOPER SUITE</Box>

            <Box mt={3} mb={1}>
              <Button
                onClick={createWorkspaceHandle}
                fullWidth
                variant="contained"
                size="large"
              >
                CREATE WORKSPACE
              </Button>
            </Box>

            <Box my={1} >
              <Button
                onClick={openWorkspaceHandle}
                fullWidth
                variant="contained"
                size="large"
              >
                OPEN EXISTING WORKSPACE
              </Button>
            </Box>

            <Box my={1} >or</Box>

            <Box my={1} >
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
            </Box>
          </Box>
          :
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
        }
      </Box>


    </>
  )

}