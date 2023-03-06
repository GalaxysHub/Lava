import React, { useContext, useState } from "react"
import { Box, Dialog, DialogContent, DialogTitle, IconButton, MobileStepper, Paper, Typography, useTheme } from "@mui/material"
import { Button } from "@mui/material"
import { AppContext } from "../../context/main"
import { useNavigate } from "react-router-dom";
import NewWorkspaceLoader from "../../components/loader/NewWorkspaceLoader"
import { Validator, Workspace } from "../../libs"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';


const steps = [
  {
    label: 'Workspace Name',
    description: `Step description`,
  },
  {
    label: 'General Settings',
    description:
      'Step description',
  },
  {
    label: 'Add Programs',
    description: `Step description`,
  },
];

export default function CustomWorkspace() {

  const theme = useTheme();
  const navigate = useNavigate();
  const { setWorkspace } = useContext(AppContext);

  const [start, setStart] = useState(false);

  const createWorkspaceHandle = (event: React.MouseEvent<HTMLElement>, value?: any) => {
    // Show loader
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

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  return (
    <>
      <Box>
        <Button
          onClick={createWorkspaceHandle}
          fullWidth
          variant="contained"
          size="large"
        >
          CREATE CUSTOM WORKSPACE
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={start}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.secondary.dark,
            }}
          >
            CREATE CUSTOM WORKSPACE
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

          <Box sx={{
            // maxWidth: 400,
            flexGrow: 1
          }}>
            <Box>
              <Typography>{steps[activeStep].label}</Typography>
            </Box>

            <Box sx={{
              height: 255,
              // maxWidth: 400,
              width: '100%',
              p: 2
            }}>
              {steps[activeStep].description}
            </Box>

            <MobileStepper
              variant="text"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
              sx={{
                bgcolor: `${theme.palette.background.default}`,
              }}
            />
          </Box>

        </DialogContent>

      </Dialog>
    </>
  )

}