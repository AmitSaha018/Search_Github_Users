import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GlobalGitHubContext } from '../context/context';
const Dashboard = () => {
  const { isLoading } = GlobalGitHubContext()

  if (isLoading) {
    return (
      <main>
      <Navbar></Navbar>
      <Search />
        <img src={ loadingImage } className='loading-img' alt="Loading..."/>
    </main>
    )
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search />
      <Info />
      <User />
      <Repos/>
    </main>
  );
};

export default Dashboard;
