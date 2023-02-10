import { Box } from "@mui/material"
import { LinearProgress } from "@mui/material"

export default function Loader() {

  return (
    <Box display={"flex"}>
      <Box margin={"auto"}>
        <LinearProgress />
      </Box>
    </Box>
  )

}