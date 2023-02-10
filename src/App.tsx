import React, {useContext} from 'react';
import Header from './components/layouts/Header';
import { Outlet } from 'react-router-dom';
import { AppContext } from './context/main';
import StartPage from './pages/StartPage';

export default function App()  {

  const {accounts} = useContext(AppContext)
  // console.log(accounts);


  return (
    <>
      {!accounts 
      ?
        <StartPage />
      :
        <>
          <Header />
          <div id="main">
              <Outlet />
          </div>
        </>  
      }
    </> 
  );
}