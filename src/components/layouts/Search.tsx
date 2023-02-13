import React, {useState} from 'react';

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


export default function Search() {

  let searchPlaceholder = 'Search tx hash / block / account / contract';

  const navigate = useNavigate();
  const location = useLocation();

  // Backdrop
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };


  const [searchString, setSearchString] = useState("");

  const handleEsc = (event:any) => {
    if (event.key === "Escape") {
      setSearchString("");
      setOpen(false);
    }
  };

  const handleSearchResult = (data:string, path:string) => {
    setSearchString("");
    setOpen(false);
    navigate(`/${path}/${data}${location.search}`, { replace: true });
  };

  const handleSearchSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TO_DO
    
  }

  return (

    <>

      <Box id="search">

        <form onSubmit={handleSearchSubmit} autoComplete="off">
          {/* <FormControl fullWidth variant="outlined" size="small" >
            <InputLabel
              sx={{ color: 'text.secondary' }}
              htmlFor="search-input"
            >
              {searchPlaceholder}
            </InputLabel>
            <Input
              id="search-input"
              value={searchString}
              // placeholder={searchPlaceholder}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton type="submit" disableRipple >
                    <SearchIcon sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(event) => setSearchString(event.target.value)}
              onKeyUp={handleEsc}
              aria-describedby="search-helper-text"
            />

          </FormControl> */}
          <input 
          placeholder={searchPlaceholder}
          onChange={(event) => setSearchString(event.target.value)}
          onKeyUp={handleEsc}
          />
          {/* <IconButton type="submit" disableRipple sx={{position:"absolute", right:"45px"}}>
            <SearchIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton> */}
        </form>

      </Box>

      <Backdrop open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </>

  );
}
