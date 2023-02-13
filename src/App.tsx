import React, {useContext} from 'react';
import Header from './components/layouts/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './components/layouts/Footer';
import { AppContext } from './context/main';

export default function App()  {

  const {accounts} = useContext(AppContext)
  // console.log(accounts);

  const navigate = useNavigate();

  if (!accounts || accounts?.length === 0) {
    navigate('/start/');
  }

  return (
    <>
      <Header />
      <div id="main">
          <Outlet />
      </div>
      <Footer />
    </> 
  );
}