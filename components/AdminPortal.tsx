import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import { Lock, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';
import { ADMIN_PASSWORD } from '../constants';

interface AdminPortalProps {
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated credential check
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  if (isLoggedIn) {
    return <AdminDashboard onBack={onBack} onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-3xl shadow-xl shadow-primary-500/20 mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">بوابة الإدارة</h1>
          <p className="text-slate-500 font-medium">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-500" />
                كلمة مرور الإدارة
              </label>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'} rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-center tracking-widest`}
                placeholder="••••••••"
              />
              {error && <p className="text-red-500 text-xs font-bold mt-1 text-center">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform active:scale-[0.98]"
            >
              دخول
              <LogIn className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للموقع الرئيسي
            </button>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-12">
          نظام الإدارة الآمن | منصة الدعم الذكي 2024
        </p>
      </div>
    </div>
  );
};

export default AdminPortal;