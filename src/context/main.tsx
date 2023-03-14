import React, { createContext, useEffect, useMemo, useState } from 'react';
import { forage } from '@tauri-apps/tauri-forage';
import { getVersion } from '@tauri-apps/api/app';
import { createTheme, CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { Workspace } from '../libs';

export type TAppContext = {
  theme: Theme;
  mode: 'light' | 'dark';
  appVersion?: string;
  workspace?: Workspace;
  isLoading: boolean;
  quickSearch?: string | undefined;
  setQuickSearch: (quickSerach: string | undefined) => void;
  handleSwitchMode: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setWorkspace: (workspace: Workspace) => void;
};

export const AppContext = createContext({} as TAppContext);


type Props = {
  children?: React.ReactNode
};
export const AppProvider: React.FC<Props> = ({ children }) => {

  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [appVersion, setAppVersion] = useState<string>();
  const [workspace, setWorkspace] = useState<Workspace | undefined>()
  const [quickSearch, setQuickSearch] = useState<string | undefined>()

  const theme = createTheme({
    components: {
      // Name of the component
      MuiLink: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s',
            textDecoration: 'none',
            // Some CSS
            '&:hover': {
              filter: 'brightness(85%)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s',
            textDecoration: 'none',
            '&:hover': {
            },
          },
        },
      },
    },
    palette: {
      mode,
      ...(mode === 'light'
        ? {
          background: {
            default: '#f5f5f5',
          },
          border: '#e5e5e5',
        }
        : {
          background: {
            default: '#2e2e2e',
          },
          border: '#444',
        }),
      primary: {
        main: '#fabe56',
        light: '#fdcd3a',
        dark: '#f77021'
      },
      secondary: {
        light: '#333',
        main: '#ccc',
        contrastText: '#666',
      },
    },
    typography: {
      allVariants: {

      },
    },
  });

  const clearState = () => {
    setIsLoading(false);
  };

  const getModeFromStorage = async () => {
    try {
      const modeFromStorage = await forage.getItem({ key: 'lava-mode' })();
      if (modeFromStorage) setMode(modeFromStorage);
    } catch (e) {
      console.error(e);
    }
  };

  const setModeInStorage = async (newMode: 'light' | 'dark') => {
    await forage.setItem({
      key: 'lava-mode',
      value: newMode,
    })();
  };

  useEffect(() => {
    getVersion().then(setAppVersion);
    getModeFromStorage();
  }, []);

  const handleSwitchMode = () =>
    setMode((currentMode) => {
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      setModeInStorage(newMode);
      return newMode;
    });

  const memoizedValue = useMemo(
    () => ({
      appVersion,
      theme,
      mode,
      workspace,
      setWorkspace,
      isLoading,
      setIsLoading,
      handleSwitchMode,
      quickSearch,
      setQuickSearch,
    }),
    [
      mode,
      isLoading,
      workspace,
      quickSearch,
    ],
  );

  return <AppContext.Provider value={memoizedValue}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></AppContext.Provider>;
};