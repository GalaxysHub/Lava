import React, {useContext} from 'react';
import Header from './components/layouts/Header';
import Nav from './components/layouts/Nav';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './components/layouts/Footer';
import { AppContext } from './context/main';

export default function App()  {

  const {workspace} = useContext(AppContext);
  // console.log(accounts);

  const navigate = useNavigate();

  if (!workspace || !workspace.accounts || workspace.countAccounts === 0) {
    navigate('/start/');
  }

  return (
    <>
      {/* <Header /> */}
      <Nav />
      <div id="main">
          <Outlet />
      </div>
      <Footer />
    </> 
  );
}