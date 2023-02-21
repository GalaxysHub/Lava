import React from "react"
import { Box, Button, Grid, Tab, Tabs, useTheme } from "@mui/material"
import PostAddIcon from '@mui/icons-material/PostAdd';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ProgramListPage() {

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Workspace Programs" {...a11yProps(0)} />
          <Tab label="Program Library" {...a11yProps(0)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        Workspace programs
      </TabPanel>

      <TabPanel value={value} index={1}>
        Program Library List
      </TabPanel>

      <Box className="tab-button-group">
        <Button variant="contained" startIcon={<PostAddIcon />}>
          Deploy Program
        </Button>
      </Box>

    </>
  )

}