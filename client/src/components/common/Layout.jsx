import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../auth/AuthModal';
import EventForm from '../events/EventForm';
import useUIStore from '../../store/uiStore';

const Layout = () => {
  const { isAuthModalOpen, isEventFormOpen } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Modals */}
      {isAuthModalOpen && <AuthModal />}
      {isEventFormOpen && <EventForm />}
    </div>
  );
};

export default Layout;