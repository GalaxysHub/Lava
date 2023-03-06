import { Box, Grid, Tab, Tabs, useTheme } from "@mui/material"
import React from "react"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function LogPage() {

  const theme = useTheme();

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        className='tabs-panel'
        bgcolor={theme.palette.background.default}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Live Log" {...a11yProps(0)} />
          <Tab label="Search in Log" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <Box mt='30px'>
        <TabPanel value={value} index={0}>
          Log items
        </TabPanel>

        <TabPanel value={value} index={1}>
          Log search
        </TabPanel>
      </Box>

    </>
  )

}