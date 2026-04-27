


import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Shared/Navbar/Navbar';
import Loading from '../components/Loading/Loading';
import Footer from '../Shared/Footer/Footer';
import FloatingWhatsApp from '../components/Shared/FloatingWhatsApp';

const Main = () => {
  const location = useLocation();
  // Only hide Navbar and Footer for login and signup pages
  const noHeaderFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-100 relative">
      {!noHeaderFooter && <Navbar />}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      {!noHeaderFooter && <Footer />}
      {!noHeaderFooter && <FloatingWhatsApp />}
    </div>
  );
};

export default Main;