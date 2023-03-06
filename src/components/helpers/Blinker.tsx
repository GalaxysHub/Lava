import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { keyframes } from '@mui/system';

interface BlinkerProps {
  color: 'success' | 'error';
}

export default function Blinker(props: BlinkerProps) {

  const { color } = props;

  const blink = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
    `;

  return (

    <FiberManualRecordIcon
      color={color}
      fontSize={'inherit'}
      sx={{
        animation: `${blink} 1.5s linear infinite`,
        mb: '-2px',
        mr: '1px'
      }}
    />

  );
}
