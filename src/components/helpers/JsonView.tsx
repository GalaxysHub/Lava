import { useTheme } from '@mui/material';
import React from 'react';
import ReactJson from 'react-json-view';

interface JsonViewProps {
  data: any;
  name?: string | false | null | undefined;
}

export default function JsonView(props: JsonViewProps) {

  const theme = useTheme();

  const {data, name} = props;
  
  return (

    <ReactJson
      src={data}
      theme={{
        base00: `${theme.palette.background.default}`,
        base01: "#ddd",
        base02: `${theme.palette.divider}`,
        base03: "#444",
        base04: `${theme.palette.secondary.main}`,
        base05: "#444",
        base06: "#444",
        base07: `${theme.palette.primary.main}`,
        base08: "#444",
        base09: "#",
        base0A: "#",
        base0B: `${theme.palette.secondary.main}`,
        base0C: "#",
        base0D: `${theme.palette.secondary.main}`,
        base0E: "#",
        base0F: `${theme.palette.secondary.main}`
      }}
      name={name ? name : 'root'}
    />

  );
}
