
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Eligibility from './components/Eligibility';
import Process from './components/Process';
import Footer from './components/Footer';
import ProposalForm from './components/ProposalForm';
import AdminPortal from './components/AdminPortal';
import { Key, ExternalLink, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'form' | 'admin'>('landing');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // If process.env.API_KEY exists and is not a placeholder, we have a key
      if (process.env.API_KEY && process.env.API_KEY !== 'undefined' && process.env.API_KEY !== '') {
        setHasKey(true);
        return;
      }
      
      // Otherwise check if user has selected one via AI Studio dialog
      try {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      // Assume success as per guidelines to avoid race conditions
      setHasKey(true);
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

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

  // If we're still checking, show nothing or a loader
  if (hasKey === null) return null;

  // If no key is available, show the selection screen
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-right font-sans" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Key className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">تفعيل ميزات الذكاء الاصطناعي</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            تستخدم هذه المنصة تقنيات Gemini لمراجعة المشاريع فورياً. يرجى اختيار مفتاح API الخاص بك للبدء. 
            يجب اختيار مفتاح من مشروع GCP مفعل به الدفع (Paid Project).
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={handleOpenKeySelector}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95"
            >
              إعداد مفتاح API الخاص بك
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              حول متطلبات الفوترة (Billing)
            </a>
          </div>
        </div>
      </div>
    );
  }

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
