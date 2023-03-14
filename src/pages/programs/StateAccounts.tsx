import React, { useContext } from "react"
import { Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton, Table, TableCell, TableContainer, TableRow, Tooltip, useTheme } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { getAnchorTypeLength } from "../../utils/helper";
import { AppContext } from "../../context/main";
import { useParams } from "react-router-dom";


interface StateAccountsProps {
  horizontal?: boolean;
  skipData?: boolean;
}

export default function StateAccounts(props: StateAccountsProps) {

  const { horizontal, skipData } = props;

  const params = useParams();

  const theme = useTheme();
  const { workspace } = useContext(AppContext);

  const [account, setAccount] = React.useState(0);

  const idl = workspace?.programs[params.programId!].idl!;

  const handlerNextAccount = () => {
    if ((account + 1) === idl.accounts?.length) {
      setAccount(0);
    } else (
      setAccount(account + 1)
    )
  }

  const handlerPrevAccount = () => {
    if (account === 0) {
      setAccount(idl.accounts!.length - 1)
    } else (
      setAccount(account - 1)
    )
  }


  const [currentField, setCurrentField] = React.useState(0);

  const handlerNextField = () => {
    if ((currentField + 1) === idl.accounts![account].type.fields.length) {
      setCurrentField(0);
    } else (
      setCurrentField(currentField + 1)
    )
  }

  const handlerPrevField = () => {
    if (currentField === 0) {
      setCurrentField(idl.accounts![account].type.fields.length - 1)
    } else (
      setCurrentField(currentField - 1)
    )
  }

  const getAccountDataTotalBytes = () => {
    let total = 0;
    idl.accounts![account].type.fields.forEach(element => {
      total += getAnchorTypeLength(element.type.toString());
    });
    return total;
  }

  const getAccountFieldStartByte = (fieldIndex: number) => {
    let total = 0;
    for (let i = 0; i < idl.accounts![account].type.fields.length; i++) {
      const currentElement = idl.accounts![account].type.fields[i];
      if (i === fieldIndex) {
        break;
      } else {
        total += getAnchorTypeLength(currentElement.type.toString());
      }
    }
    return total;
  }

  return (
    <Box
      display={horizontal ? 'flex' : 'block'}
    >
      <Box width={horizontal ? '50%' : 'unset'}>
        <Box
          mt={-1}
          mb={1}
          position={'sticky'}
          top={0}
          display={'flex'}
          justifyContent={'space-between'}
          bgcolor={theme.palette.background.default}
          zIndex={999}
        >
          <Tooltip title="Prev" arrow placement="bottom" >
            <IconButton
              disabled={idl.accounts!.length <= 1}
              onClick={handlerPrevAccount}
              sx={{ ml: '10px' }}
            >
              <ChevronLeftIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <Box
            margin={'auto'}
            textTransform={'uppercase'}
            fontSize={'0.9rem'}
            color={theme.palette.primary.main}
          >
            {idl.accounts?.map((account, index) => (
              account.name
            ))}
          </Box>

          <Tooltip title="Next" arrow placement="bottom" >
            <IconButton
              disabled={idl.accounts!.length <= 1}
              onClick={handlerNextAccount}
              sx={{ mr: '0px' }}
            >
              <ChevronRightIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* <Divider /> */}

        {!skipData &&
          <>
            {
              idl.accounts![account].type.fields.map((item, index) => (
                <Box
                  // mb={1} 
                  pr={0.3}
                  display={'flex'}
                >
                  <Box minWidth={'30px'}>
                    {(index === currentField) &&
                      <ArrowRightIcon color="primary" fontSize="large" sx={{ p: 0 }} />
                    }
                  </Box>

                  <Box width={'100%'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Box color={theme.palette.divider} fontSize={'0.85rem'} mb={-0.5}>
                        {item.type.toString()}&nbsp;
                      </Box>
                      <Box color={theme.palette.primary.main} fontSize={'0.85rem'} mb={-0.5}>
                        {item.name}
                      </Box>
                    </Box>
                    <Box>
                      <Skeleton
                        animation={false}
                      // width={200}
                      />
                    </Box>
                  </Box>
                </Box>
              ))
            }
          </>
        }

        {/* <Divider /> */}
      </Box>

      <Box
        mt={2.5}
        width={horizontal ? '50%' : 'unset'}
      >
        <Box
          mb={0.5}
          textAlign={'center'}
          color={theme.palette.secondary.main}
          fontSize={'0.8rem'}
          textTransform={'uppercase'}
          position={'sticky'}
          top={10}
          bgcolor={theme.palette.background.default}
          zIndex={999}
        >
          {`Data memory allocation:`}
        </Box>

        <Box
          display={'flex'}
          justifyContent={'space-between'}
          mb={1}
          position={'sticky'}
          top={30}
          bgcolor={theme.palette.background.default}
          zIndex={999}
        >
          <Tooltip title="Prev" arrow placement="bottom" >
            <IconButton
              onClick={handlerPrevField}
              sx={{ ml: '10px' }}
            >
              <ChevronLeftIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <Box
            mb={0.5}
            maxWidth={'400px'}
            margin={'auto'}
            textAlign={'center'}
            fontSize={'0.8rem'}
          >
            <Box display={'flex'} >
              <Box color={theme.palette.primary.main} mr={0.5}>
                {idl.accounts![account].type.fields[currentField].name}
              </Box>
              <Box color={theme.palette.secondary.dark}>
                {idl.accounts![account].type.fields[currentField].type.toString()}
              </Box>
            </Box>
            {!skipData &&
              <Box>
                <Skeleton
                // width={'100px'} 
                // sx={{ display: 'flex', justifyContent: 'center' }} 
                />
              </Box>
            }
          </Box>

          <Tooltip title="Next" arrow placement="bottom" >
            <IconButton
              onClick={handlerNextField}
              sx={{ mr: '20px' }}
            >
              <ChevronRightIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box maxWidth={'90%'} margin={'auto'}>
          {idl.accounts![account].type.fields.map((item, index) => (
            Array.from(Array(getAnchorTypeLength(item.type.toString())).keys()).map(byte => (
              <Tooltip
                enterDelay={1000}
                enterNextDelay={1000}
                title={`${item.name} ${byte}(th) byte`}
                arrow
                placement="top"
              // PopperProps={{ sx:{backgroundColor:'transparent'} }}
              >
                <Box className='memory-cell'>
                  <Box
                    bgcolor={
                      (index === currentField)
                        ?
                        theme.palette.primary.dark
                        :
                        theme.palette.secondary.main
                    }
                    color={theme.palette.common.black}
                  >
                    <Box margin={'auto'}>
                      {getAccountFieldStartByte(index) + byte}
                    </Box>
                  </Box>
                </Box>
              </Tooltip>
            ))
          ))}
        </Box>

        <Box 
        mt={2}
        fontSize={'0.8rem'}
        textTransform={'uppercase'}
        textAlign={'center'}
        color={theme.palette.secondary.main}
        >
          {getAccountDataTotalBytes()} bytes total
        </Box>
      </Box>

    </Box>
  )

}