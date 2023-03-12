import React, { useContext, useState, useEffect } from 'react';
import bs58 from "bs58";
import { useLocation, NavLink, useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Divider, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Popover, Tooltip, Typography, useTheme } from '@mui/material';
import { getTransaction, searchBlock, searchTxByAccount } from '../../utils/fetch';
import { AppContext } from '../../context/main';
import { arrayBuffer } from 'node:stream/consumers';
import { isNumeric, minimizeStr, timeConverter, timeSince } from '../../utils/helper';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CodeIcon from '@mui/icons-material/Code';


type TSearchResult = {
  type: 'block' | 'tx' | 'account' | 'program',
  name: string,
  info: string | undefined,
  target: string,
}

const searchPlaceholder = 'Search tx hash / block / account / program';

export default function Search() {

  const theme = useTheme();

  const { workspace, quickSearch, setQuickSearch } = useContext(AppContext);

  const [searchResults, setSearchResults] = useState<TSearchResult[]>([]);

  const navigate = useNavigate();

  const [searchString, setSearchString] = useState("");

  const elementWidth = document.getElementById('search')?.getBoundingClientRect().width || 0;

  const [anchorEl, setAnchorEl] = React.useState<HTMLFormElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleEsc = (event: any) => {
    if (event.key === "Escape") {
      setSearchString("");
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);

    setSearchResults([]);

    let arr: TSearchResult[] = [];
    const decoded = bs58.decode(searchString);

    if (decoded.length === 64) {

      getTransaction(workspace?.cluster.endpoint!, searchString)
        .then((data) => {
          console.log(data);
          if (data) {
            arr.push(
              {
                type: 'tx',
                name: data.transaction.signatures[0],
                info: timeSince(data.blockTime),
                target: `/txs/${data.transaction.signatures[0]}`,
              }
            )
            setSearchResults(arr)
          }
        })
        .catch((error) => {
          console.log(error);
        });

    } else if (decoded.length === 32) {
      // search accounts inside transactions 
      searchTxByAccount(workspace?.cluster.endpoint!, searchString)?.then((data) => {
        if (data) {
          data.forEach(tx => {
            arr.push(
              {
                type: 'tx',
                name: tx.signature,
                info: timeSince(tx.blockTime),
                target: `/txs/${tx.signature}`,
              }
            )
          });

          setSearchResults(arr)
        }
      })
        .catch((error) => {
          console.log(error);
        });
    } else if (isNumeric(searchString)) {
      // Block search
      searchBlock(workspace?.cluster.endpoint!, Number(searchString))?.then((data) => {
        if (data) {
          arr.push(
            {
              type: 'block',
              name: data.blockhash,
              info: timeSince(data.blockTime),
              target: `/blocks/${data.blockhash}`,
            }
          )
        }
        setSearchResults(arr)
      })
        .catch((error) => {
          console.log(error);
        });
    }

    (document.getElementById('search-input') as HTMLInputElement).value = '';
    (document.getElementById('search-form') as HTMLFormElement).reset();

  }

  const handleResultClick = (event: React.MouseEvent<HTMLElement>, target = "/") => {
    // (document.getElementById('search-input') as HTMLInputElement).value = '';
    (document.getElementById('search-form') as HTMLFormElement).reset();
    setSearchString("");
    setAnchorEl(null);
    navigate(target, { replace: true });
  };

  const autoSearch = (str: string | undefined) => {
    setSearchResults([]);
    if (str) {
      setSearchString(str);
      // (document.getElementById('search-input') as HTMLInputElement).value = str;
      (document.getElementById('search-form') as HTMLFormElement).requestSubmit();
    }
  }

  useEffect(() => {
    autoSearch(quickSearch);
    setQuickSearch(undefined);
  }, [quickSearch]);

  return (

    <>

      <Box id="search">
        <Box
          component="form"
          id="search-form"
          onSubmit={handleSearchSubmit}
          autoComplete="off"
          sx={{
            mr: '5px',
            p: '0px 4px',
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${theme.palette.secondary.main}`,
            borderRadius: '8px'
          }}
        >
          {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <InputBase
            id="search-input"
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
            placeholder={searchPlaceholder}
            inputProps={{ 'aria-label': `${searchPlaceholder}` }}
            onChange={(event) => setSearchString(event.target.value)}
            onKeyUp={handleEsc}
            aria-controls={open ? 'search-result-block' : undefined}
            aria-haspopup="true"
          />

          <Divider
            sx={{ height: 22, m: 0.3 }}
            orientation="vertical"
          />

          <IconButton
            type="submit"
            sx={{ p: '6px' }}
            aria-label="search"
          >
            <SearchIcon fontSize='small' />
          </IconButton>
        </Box>

        <Menu
          id="search-result-block"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'search-input',
          }}
          // sx={{ width: `${Math.floor(elementWidth)}px` }}
          PaperProps={{ sx: { width: `${Math.floor(elementWidth)}px`, maxHeight: '85vh' } }}
        >
          {searchResults.length > 0
            ?
            searchResults.map(item => (
              <MenuItem dense onClick={event => handleResultClick(event, item.target)}>
                <ListItemIcon>
                  {item.type === 'tx'
                    &&
                    <Tooltip title='Transaction' arrow placement="left" >
                      <ListAltIcon fontSize='inherit' color='disabled' />
                    </Tooltip>
                  }

                  {item.type === 'block'
                    &&
                    <Tooltip title='Block' arrow placement="left" >
                      <ViewInArIcon fontSize='inherit' color='disabled' />
                    </Tooltip>
                  }

                  {item.type === 'account'
                    &&
                    <Tooltip title='Account' arrow placement="left" >
                      <AccountBoxIcon fontSize='inherit' color='disabled' />
                    </Tooltip>
                  }

                  {item.type === 'program'
                    &&
                    <Tooltip title='Program' arrow placement="left" >
                      <CodeIcon fontSize='inherit' color='disabled' />
                    </Tooltip>
                  }
                </ListItemIcon>

                <ListItemText className={'search-item-name'}>
                  {item.name}
                </ListItemText>

                <Typography variant="body2" color="primary.main">
                  {item.info}
                </Typography>

              </MenuItem>
            ))
            :
            <MenuItem
              dense
              disabled
            >
              <ListItemText>
                {/* <Typography variant="body2" color="secondary.main"> */}
                No Results Found.
                {/* </Typography> */}
              </ListItemText>
            </MenuItem>
          }

          {/* <Divider /> */}

          <MenuItem dense disabled className={'search-result-footer'}>
            {searchResults.length > 1 && <><Box component={'span'} bgcolor={theme.palette.secondary.dark}>▼</Box> <Box component={'span'} bgcolor={theme.palette.secondary.dark}>▲</Box> to navigate </>}<Box component={'span'} bgcolor={theme.palette.secondary.dark}>ESC</Box> to Cancel  {searchResults.length > 1 && <><Box component={'span'} bgcolor={theme.palette.secondary.dark}>↵</Box> to Enter</>}
          </MenuItem>

        </Menu>

      </Box>

      {/* <Backdrop open={open}></Backdrop>  */}

    </>

  );
}
