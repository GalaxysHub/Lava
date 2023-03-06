import React from "react"
import { Box, Button, Grid, Stack, Tab, Tabs, useTheme } from "@mui/material"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function SettingsPage() {

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
          <Tab label="General settings" {...a11yProps(0)} />
          <Tab label="Explorer settings" {...a11yProps(1)} />
          <Tab label="Workspaces settings" {...a11yProps(1)} />
          <Tab label="About" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <Box mt='30px'>
        <TabPanel value={value} index={0}>
          General settings
        </TabPanel>

        <TabPanel value={value} index={1}>
          Explorer settings
        </TabPanel>

        <TabPanel value={value} index={2}>
          Workspaces settings
        </TabPanel>

        <TabPanel value={value} index={3}>
          About us
        </TabPanel>
      </Box>


      <Box className="tab-button-group">
        <Stack spacing={1} direction="row">
          <Button variant="outlined">
            Cancel
          </Button>

          <Button variant="contained">
            Save Settings
          </Button>
        </Stack>
      </Box>


    </>
  )

}