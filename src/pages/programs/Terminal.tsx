import React, { useContext, useState } from "react"
import { Box, Button, IconButton, InputBase, Stack, Tooltip, useTheme } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AppContext } from "../../context/main";
import { cliExecute } from "../../utils/cli";


interface TerminalCommands {
  input: string;
  output: string[];
}

export default function ErrorPage() {

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [open, setOpen] = useState(true);

  const [currentInput, setCurrentInput] = useState('');

  const [commands, setCommands] = useState<TerminalCommands[]>([])

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event?.key === "Enter") {

      if (currentInput === 'clear') {
        setCommands([]);
        setCurrentInput('');
        return;
      }

      const cliResponse = await cliExecute(currentInput);
      const newCommand: TerminalCommands = {
        input: currentInput,
        output: cliResponse,
      }
      setCommands(oldData => [newCommand, ...oldData]);
      setCurrentInput('');
    }
    // console.log(event?.key)
  };

  const handlerOpenClose = () => {
    setOpen(!open);
  }

  const promt = '$:'

  return (
    <Box
      bgcolor={'#252525'}
      fontSize={'0.9rem'}
      height={open ? '25%' : '55px'}
      width={'50%'}
      px={2}
      py={0.5}
      sx={{
        position: 'absolute',
        bottom: '0px',
        right: 0,
        pr: '-15px !important',
        opacity: '0.98',
      }}
      zIndex={999}
    >
      <Box
        width={'100%'}
        fontSize={'0.8rem'}
        color={theme.palette.primary.dark}
      >
        <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Button sx={{ p: '0 10px', fontSize: '0.7rem' }}>
              DEBUG CONSOLE
            </Button>

            <Button sx={{ p: '0 10px', fontSize: '0.7rem' }}>
              Chain Output
            </Button>

            <Button sx={{ p: '0 10px', fontSize: '0.7rem' }}>
              Terminal
            </Button>

            <Button sx={{ p: '0 10px', fontSize: '0.7rem' }}>
              ERRORS
            </Button>

          </Box>

          <Box mr={3}>
            <Tooltip title="Clear All" arrow placement="bottom" >
              <IconButton
                onClick={(event) => setCommands([])}
                sx={{ mr: '10px', p: '0', fontSize: '0.9rem' }}
              >
                <DeleteOutlineIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

            <IconButton 
            sx={{ p: '0', fontSize: '1.3rem' }}
            onClick={handlerOpenClose}
            >
              {open
                ?
                <KeyboardArrowDownIcon fontSize="inherit" />
                :
                <KeyboardArrowUpIcon fontSize="inherit" />
              }
            </IconButton>
          </Box>

        </Box>

        <Box
          pl={1}
          pt={0.5}
          pr={3}
          height={'100%'}
          sx={{maxHeight:'180px', overflowY: 'scroll'}}
        >
          {commands.length === 0
            ?
            <>
              $:
              <InputBase
                id='terminal-command-0-input'
                sx={{
                  ml: 1,
                  fontSize: '0.85rem',
                  // border: '1px solid #ccc', 
                  width: '97%',
                  maxHeight: '90%',
                  overflow: 'auto',
                  color: `${theme.palette.secondary.main}`
                }}
                value={currentInput}
                // placeholder={'grep placeholder'}
                // inputProps={{ 'aria-label': `grep placeholder` }}
                onChange={(event) => setCurrentInput(event.target.value)}
                onKeyUp={handleEnter}
                // multiline
                autoFocus
              />
            </>
            :
            <>
              {commands.reverse().map((command, commandIndex) => (
                <>
                  <Box
                    // display={'inline'}
                    id={`terminal-command-${commandIndex}-input`}
                    sx={{
                      ml: 0,
                      fontSize: '0.85rem',
                      // border: '1px solid #ccc', 
                      width: '97%',
                      maxHeight: '90%',
                      overflow: 'auto',
                      color: `${theme.palette.secondary.main}`
                    }}
                  >
                    $: {command.input}
                  </Box>

                  {command.output.map((item, index) => (
                    <Box
                      id={`terminal-command-${commandIndex}-output-${index}`}
                      sx={{
                        // ml: 1,
                        fontSize: '0.85rem',
                        // border: '1px solid #ccc', 
                        width: '97%',
                        maxHeight: '90%',
                        overflow: 'auto',
                        color: `${theme.palette.text.disabled}`
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </>
              ))}
              <>
                $:
                <InputBase
                  id='terminal-command-0-input'
                  sx={{
                    ml: 1,
                    fontSize: '0.85rem',
                    // border: '1px solid #ccc', 
                    width: '97%',
                    maxHeight: '90%',
                    overflow: 'auto',
                    color: `${theme.palette.secondary.main}`
                  }}
                  value={currentInput}
                  // placeholder={'grep placeholder'}
                  // inputProps={{ 'aria-label': `grep placeholder` }}
                  onChange={(event) => setCurrentInput(event.target.value)}
                  onKeyUp={handleEnter}
                  // multiline
                  autoFocus
                />
              </>
            </>
          }
        </Box>
      </Box>
    </Box>
  )

}