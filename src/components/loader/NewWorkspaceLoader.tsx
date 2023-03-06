import { Box } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"

const MESSAGES_INTERVAL = 600;

export default function NewWorkspaceLoader() {
  let events: string[] = [
    "Creating accounts ...",
    "Starting test validator ...",
    "Preparing workspace ..."
  ]

  const [statusString, setStatusString] = useState("");


  useEffect(() => {
    setStatusString("Starting Test Validator");
  }, []);

  return (
    <Box minHeight={'200px'}>

      <Box my={4} textAlign={"center"}>
        <CircularProgress size={100} thickness={2} />
      </Box>

      <Box id="status-message" mt={4} mb={4} textAlign={"center"}>
        {statusString}
      </Box>

    </Box>
  )

}