import React, { useState } from 'react';

import { useLocation, NavLink, useNavigate, useSearchParams } from "react-router-dom";

import Box from '@mui/material/Box';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Menu, MenuItem, Popover } from '@mui/material';
import { getTransaction } from '../../utils/fetch';


type TSearchResult = {
  name: string,
  target: string,
}

export default function Search() {

  let searchPlaceholder = 'Search tx hash / block / account / contract';
  const elementWidth = document.getElementById('search')?.getBoundingClientRect().width || 0;

  const [searchResults, setSearchResults] = useState<TSearchResult[]>([]);

  const navigate = useNavigate();
  const location = useLocation();


  const [searchString, setSearchString] = useState("");

  const handleEsc = (event: any) => {
    if (event.key === "Escape") {
      setSearchString("");
      // setOpen(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TO_DO
    setAnchorEl(event.currentTarget);
    // console.log(elementWidth)
    getTransaction(searchString)
    .then((data) => {

    })
    .catch((error) => {
        console.log(error);
    });
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLFormElement | null>(null);


  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleResultClick = (event: React.MouseEvent<HTMLElement>, target="/") => {
    setSearchString("");
    setAnchorEl(null);
    // setOpen(false);
    // navigate(`/${location.search}`, { replace: true });
    console.log('event:', target)
  };

  return (

    <>

      <Box id="search">

        {/* <form onSubmit={handleSearchSubmit} autoComplete="off">
          <input
            placeholder={searchPlaceholder}
            onChange={(event) => setSearchString(event.target.value)}
            onKeyUp={handleEsc}
            aria-describedby={id}
          />
          <IconButton type="submit" disableRipple sx={{position:"absolute", right:"45px"}}>
            <SearchIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </form>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ width: '300px' }}
        >
          Search results
        </Popover> */}

        <form onSubmit={handleSearchSubmit} autoComplete="off">
          <input
            id="search-input"
            aria-controls={open ? 'result-block' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            placeholder={searchPlaceholder}
            onChange={(event) => setSearchString(event.target.value)}
            onKeyUp={handleEsc}
          />

        </form>
        <Menu
          id="result-block"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'search-input',
          }}
          sx={{ width: `${Math.floor(elementWidth)}px` }}
        >
          {searchResults.length > 0
            ?
            searchResults.map(item => (
              <MenuItem onClick={event => handleResultClick(event, item.target)}>{item.name}</MenuItem>
            ))
            :
            <MenuItem onClick={event => handleResultClick(event, "")}>No results found</MenuItem>
          }


        </Menu>



      </Box>

      {/* <Backdrop 
      open={open} 
      onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop> */}

    </>

  );
}
