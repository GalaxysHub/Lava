import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Divider, FormControlLabel, IconButton, InputBase, Radio, RadioGroup, Switch, TextField, Tooltip, useTheme } from "@mui/material";
import { AppContext } from "../../context/main";


export default function LiveLog() {

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [liveMode, setLiveMode] = useState(true)
  const handleLiveModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveMode(event.target.checked);
  };

  const [grepVariant, setGrepVariant] = useState('warn');
  const [grepString, setGrepString] = useState("");
  const handleChangeGrepVariant = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrepVariant(event.target.value);
  };
  const handleGrepApply = () => {
    const request = {} // TODO
    
    if (grepVariant !== 'grep') {
      // console.log(grepVariant);
      // request = {} // TODO
    } else {
      // console.log(grepString);
      // request = {} // TODO
    }

    // Tauri request goes here (something like that :))
    // *Dean*
    // requestTauri(request).
    // then(response => {
    //   setLines(oldData => [response, ...oldData])
    // })
  }

  const [lines, setLines] = useState<string[]>([])

  const handleClear = () => {
    setLines([]);
  }


  useEffect(() => {

    if (liveMode && workspace) {

      // TODO
      // setLines([]);
    }

  }, [liveMode]);

  return (
    <>
      <Box
        display={'flex'}
        sx={{ justifyContent: 'space-between' }}
      >
        <Box display={'flex'}>
          <Box color={theme.palette.primary.main} mt={0.8}>
            Log Live mode:
          </Box>

          <Box mt={0.8} mr={3}>
            <Switch
              color="primary"
              size="small"
              checked={liveMode}
              onChange={handleLiveModeChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>

        <Box display={'flex'}>
          <RadioGroup
            row
            aria-labelledby="form-control-greps"
            name="greps"
            onChange={handleChangeGrepVariant}
            defaultValue="warn"
          >
            <FormControlLabel
              value="warn"
              control={<Radio size="small" />}
              label="<WARN> only"
              labelPlacement="end"
            />
            <FormControlLabel
              value="err"
              control={<Radio size="small" />}
              label="<ERR> only"
              labelPlacement="end"
            />
            <FormControlLabel
              value="grep"
              control={<Radio size="small" />}
              label="<grep> by:"
              labelPlacement="end"
            />

            <Box
              sx={{
                p: '0px 4px',
                display: 'flex',
                minWidth: '400px',
                alignItems: 'center',
                border: `1px solid ${theme.palette.secondary.dark}`,
                borderRadius: '4px'
              }}
            >
              <InputBase
                disabled={grepVariant !== 'grep'}
                value={grepString}
                id="search-input"
                sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
                placeholder={'enter string to grep by ...'}
                inputProps={{ 'aria-label': `grep placeholder` }}
                onChange={(event) => setGrepString(event.target.value)}
              />
            </Box>
            <Button
              onClick={handleGrepApply}
              size="small"
            >
              APPLY
            </Button>

          </RadioGroup>
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
        sx={{ overflow: 'auto' }}
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