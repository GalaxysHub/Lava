import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { keyframes } from '@mui/system';


export default function Blinker() {

  const blink = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
    `;

  return (

    <FiberManualRecordIcon
      color={'success'}
      fontSize={'inherit'}
      sx={{animation: `${blink} 1.5s linear infinite`, mb:'-2px', mr:'1px' }}
    />
    
  );
}
