import React, { createContext, useEffect, useMemo, useState } from 'react';
import { forage } from '@tauri-apps/tauri-forage';
import { getVersion } from '@tauri-apps/api/app';
import { generateKeypairs } from '../utils/helper';
import { TAccounts, TSettings } from '../libs/types';
import { createTheme, Theme, ThemeProvider } from '@mui/material';

export type TAppContext = {
  theme: Theme;
  mode: 'light' | 'dark';
  appVersion?: string;
  accounts?: TAccounts[];
  settings: TSettings;
  isLoading: boolean;
  handleSwitchMode: () => void;
  setIsLoading: (isLoading: boolean) => void;
  collectAccounts: (n: number) => void;
};

export const AppContext = createContext({} as TAppContext);


type Props = {
  children?: React.ReactNode
};
export const AppProvider: React.FC<Props> = ({ children }) => {

  const [accounts, setAccounts] = useState<TAccounts[]>();
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [appVersion, setAppVersion] = useState<string>();
  const [settings, setSettings] = useState<TSettings>({
    validatorHostame: "127.0.0.1",
    vaidatorPort: 8899,
    keysCount: 10,
  })

  const theme = createTheme({
    components: {
      // Name of the component
      MuiLink: {
        styleOverrides: {
          // Name of the slot
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
          // Name of the slot
          root: {
            // backgroundColor: '#64bdac',
            transition: 'all 0.3s',
            textDecoration: 'none',
            // Some CSS
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
            default: '#202124',
          },
          border: '#444',
        }),
      primary: {
        main: '#64bdac',
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
    setAccounts(undefined);
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

  const collectAccounts = (n: number) => {
    const accounts = generateKeypairs(n);
    setAccounts(accounts);
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
      settings,
      setSettings,
      isLoading,
      setIsLoading,
      accounts,
      collectAccounts,
      handleSwitchMode,
    }),
    [
      mode,
      isLoading,
      accounts
    ],
  );

  return <AppContext.Provider value={memoizedValue}><ThemeProvider theme={theme}>{children}</ThemeProvider></AppContext.Provider>;
};