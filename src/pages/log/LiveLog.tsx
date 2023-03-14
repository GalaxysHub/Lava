import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Divider, FormControlLabel, IconButton, InputBase, Radio, RadioGroup, Switch, TextField, Tooltip, useTheme } from "@mui/material";
import { AppContext } from "../../context/main";


const dummyLog = ``;

const log = dummyLog.split('\n');

export default function LiveLog() {

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [liveMode, setLiveMode] = useState(false)
  const handleLiveModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveMode(event.target.checked);
    // setLiveMode(!liveMode);

  };

  const [grepVariant, setGrepVariant] = useState('INFO');
  const [grepColor, setGrepColor] = useState('green');
  const [grepString, setGrepString] = useState("INFO");
  const [grep, setGrep] = useState('INFO');

  const handleChangeGrepVariant = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrepVariant(event.target.value);
    switch (event.target.value) {
      case 'INFO':
        setGrepColor('green');
        setGrep('INFO')
        break;
      case 'WARN':
        setGrepColor('yellow');
        setGrep('WARN')
        break;
      case 'ERR':
        setGrepColor('red');
        setGrep('ERR')
        break;
    }
  };
  const handleGrepApply = (event: React.FormEvent<HTMLButtonElement>) => {
    const request = {} // TODO

    if (grepVariant !== 'grep') {
      // console.log(grepVariant);
      // request = {} // TODO

    } else {
      setGrepColor(theme.palette.primary.main);
      setGrep(grepString)
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

      let i = 0;
      // create an interval which will increment the step
      const timer = setInterval(() => {
        if (i < log.length) {
          i++;
          setLines(oldData => [log[i], ...oldData]);
        } else {
          // stop here because we have reached the end of steps
          i = 0;
        }
      }, 200);

      //destroy interval on unmount
      return () => clearInterval(timer)
    }

    console.log(grepString)
    console.log(grepColor)
    console.log(grepVariant)

  }, [liveMode, grepString]);

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
            defaultValue="INFO"
          >
            <FormControlLabel
              value="INFO"
              control={<Radio size="small" />}
              label="<INFO> only"
              labelPlacement="end"
            />
            <FormControlLabel
              value="WARN"
              control={<Radio size="small" />}
              label="<WARN> only"
              labelPlacement="end"
            />
            <FormControlLabel
              value="ERR"
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
                autoComplete="off"
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
              line.includes(grep) && (
                <li
                  dangerouslySetInnerHTML={{
                    __html: `${line.replace(grep, match => `<span style="color: ${grepColor}">${match} </span>`)}`
                  }}>
                </li>
              )
            ))
          )}
        </ul>
      </Box>
    </>
  )

}