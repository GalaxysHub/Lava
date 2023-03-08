import React, { useContext, useEffect, useState } from "react"
import { Box, Button, InputBase, useTheme } from "@mui/material";
import { AppContext } from "../../context/main";

export default function LogSearch() {

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [lines, setLines] = useState<string[]>([])
  const [searchString, setSearchString] = useState("");

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO
    // console.log(searchString);

    // Tauri request goes here
    // *Dean*
    // requestTauri(searchString).
    // then(response => {
    //   setLines(response)
    // })
  }

  return (
    <>
      <Box
        // className="filter-bar"
        display={'flex'}
        sx={{ justifyContent: 'space-between' }}
      >
        <Box display={'flex'}>
          <Box
            mt={0.8}
            mr={1}
            color={theme.palette.primary.main}
          >
            Search in Validator Log:
          </Box>

          <Box>
            <Box
              component="form"
              id="search-log-form"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
              sx={{
                // mr: '5px',
                p: '1px 4px',
                display: 'flex',
                minWidth: '500px',
                alignItems: 'center',
                border: `1px solid ${theme.palette.secondary.dark}`,
                borderRadius: '4px'
              }}
            >
              <InputBase
                id="search-log-input"
                sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
                placeholder={'grep placeholder'}
                inputProps={{ 'aria-label': `grep placeholder` }}
                onChange={(event) => setSearchString(event.target.value)}
              // onKeyUp={handleEsc}
              />
              <Button
                size="small"
                type="submit"
              >
                SEARCH
              </Button>
            </Box>

          </Box>
        </Box>



      </Box>

      <Box
        bgcolor={'#222'}
        color={'#ccc'}
        mt={2}
        p={'10px 15px 10px 0px'}
        fontSize={'0.9rem'}
        minHeight={'75vh'}
        maxHeight={'75vh'}
        sx={{ overflow: 'auto'}}
      >
        <ul>
          {lines?.length > 0 && (
            lines.map((line, index) => (
              <li>{line}</li>
            ))
          )}
        </ul>
      </Box>
    </>
  )

}