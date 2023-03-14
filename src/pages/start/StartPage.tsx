import React from "react"
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, useTheme } from "@mui/material"
import QuickStart from "./QuickStart";
import OpenWorkspace from "./OpenWorkspace";
import CustomWorkspace from "./CustomWorkspace";

export default function StartPage() {

  const theme = useTheme();

  return (
    <Box id="start-page" bgcolor={theme.palette.secondary.light} textAlign={"center"} display="flex" height={"100vh"}>

      <Box margin={"auto"} minWidth="300px" color={theme.palette.common.white} >

        <img src="/logo-horizontal.svg" alt="LAVA" />
        {/* <Box component={'span'} fontSize={'3.5rem'} fontWeight="700" letterSpacing={"0.5rem"}>
          
        </Box> */}
        {/* <br /> */}
        {/* <Box component={'span'} fontSize={'0.8rem'}>SOLANA DEVELOPER SUITE</Box> */}

        <Box mt={3} mb={1}>
          <CustomWorkspace />
        </Box>

        <Box my={1} >
          <OpenWorkspace />
        </Box>

        <Box my={1} >or</Box>

        <Box my={1} >
          <QuickStart />
        </Box>

        <Box mt={4}>
          <FormControl>
            <FormLabel id="row-radio-buttons-group-label">Validator Node Type:</FormLabel>
            <RadioGroup
              row
              defaultValue="lava"
              aria-labelledby="row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="lava" control={<Radio size="small"/>} label="Lava Embeded" />
              <FormControlLabel value="solana" control={<Radio size="small"/>} label="Solana CLI" />
            </RadioGroup>
          </FormControl>
        </Box>

      </Box>

    </Box>
  )

}