import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Eligibility from './components/Eligibility';
import Process from './components/Process';
import Footer from './components/Footer';
import ProposalForm from './components/ProposalForm';
import AdminPortal from './components/AdminPortal';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'form' | 'admin'>('landing');

  const navigateToForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setView('form');
    window.scrollTo(0, 0);
  };

  const navigateToHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setView('landing');
    window.scrollTo(0, 0);
  };

  const navigateToAdmin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setView('admin');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {view !== 'admin' && <Navbar onFormClick={navigateToForm} onLogoClick={navigateToHome} />}
      <main>
        {view === 'landing' && (
          <>
            <Hero onFormClick={navigateToForm} />
            <About />
            <Eligibility />
            <Process onFormClick={navigateToForm} />
          </>
        )}
        {view === 'form' && (
          <ProposalForm onBack={navigateToHome} />
        )}
        {view === 'admin' && (
          <AdminPortal onBack={navigateToHome} />
        )}
      </main>
      <Footer onHomeClick={navigateToHome} onAdminClick={navigateToAdmin} />
    </div>
  );
};

export default App;