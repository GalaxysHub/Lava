import { Box } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"


const MESSAGES_INTERVAL = 600;

export default function NewWorkspaceLoader() {

  // JUST DUMMY LOADER
  // TO-DO: Real processing event messages

  let events: string[] = [
    "Creating accounts ...",
    "Starting test validator ...",
    "Preparing workspace ..."
  ]

  const [statusString, setStatusString] = useState("");


  useEffect(() => {

    const interval = setInterval(() => {
      console.log(events)
      setStatusString(events[0]);
      events.shift();

      if (!events.length) {
        clearInterval(interval);
      }
    }, MESSAGES_INTERVAL);

    return () => {
      clearInterval(interval);
    };
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