import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import AccountListPage from './pages/accounts/AccountsListPage';
import ProgramListPage from './pages/programs/ProgramListPage';
import BlockDetailsPage from './pages/explorer/BlockDetailsPage';
import TransactionDetailsPage from './pages/explorer/TransactionDetailsPage';
import LogPage from './pages/log/LogPage';
import SettingsPage from './pages/settings/SettingsPage';
import FaucetPage from './pages/faucet/FaucetPage';
import WalletPage from './pages/wallet/WalletPage';
import ErrorPage from './pages/ErrorPage';
import StartPage from './pages/start/StartPage';
import { AppProvider } from './context/main';
import reportWebVitals from './reportWebVitals';
import ExplorerPage from './pages/explorer/ExplorerPage';
import ProgramDetailsPage from './pages/programs/ProgramDetailsPage';
import AccountDetailsPage from './pages/explorer/AccountDetailsPage';


const router = createBrowserRouter([
  {
    path: "start/",
    element: <StartPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "accounts/",
        element: <AccountListPage />,
      },
      {
        path: "accounts/:accountId",
        element: <AccountDetailsPage />,
      },
      {
        path: "programs/",
        element: <ProgramListPage />,
      },
      {
        path: "programs/:programId",
        element: <ProgramDetailsPage />,
      },
      {
        path: "explorer/",
        element: <ExplorerPage />,
      }, 
      {
        path: "blocks/:blockId",
        element: <BlockDetailsPage />,
      },
      {
        path: "txs/:txId",
        element: <TransactionDetailsPage />,
      },
      {
        path: "faucet/",
        element: <FaucetPage />,
      },
      {
        path: "logs/",
        element: <LogPage />,
      },
      {
        path: "wallet/",
        element: <WalletPage />,
      },
      {
        path: "settings/",
        element: <SettingsPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
