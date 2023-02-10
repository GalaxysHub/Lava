import React, { FC, useState } from 'react';

import Box from '@mui/material/Box';

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Snackbar, {SnackbarCloseReason} from '@mui/material/Snackbar';

interface CopyProps {
    textToCopy: string,
    notification: string,
  }
  

export const CopyToClipboard:FC<CopyProps> =(props) => {


    const [open, setOpen] = React.useState(false);

    const handleClose = (event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [text, setText] = useState(props.textToCopy);
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text:string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(text)
        .then(() => {
            if (props.notification === 'snackbar') {    
                setOpen(true);
            } else {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);   
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        
        <Box sx={{ display: 'inline', mx: '5px' }} >

            <ContentCopyOutlinedIcon 
                sx={{ 
                    color: 'text.secondary',
                    "&:hover": {color: 'text.primary'},
                    transition: 'all 0.3s',
                    display: 'inline',
                    cursor: 'pointer',
                }}
                fontSize='inherit'
                // color="primary"
                onClick={handleCopyClick}
            />
            <span>{isCopied && 'Copied!'}</span>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={1500}
                message={'copied: ' + text}
                onClose={handleClose}
            />

        </Box>

    );
}
