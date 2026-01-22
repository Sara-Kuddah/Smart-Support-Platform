import React from 'react';
import { Mail, Phone, HeartHandshake, ShieldEllipsis } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

interface FooterProps {
  onHomeClick: (e: React.MouseEvent) => void;
  onAdminClick: (e: React.MouseEvent) => void;
}

const Footer: React.FC<FooterProps> = ({ onHomeClick, onAdminClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <button 
              onClick={onHomeClick}
              className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity outline-none"
            >
              <HeartHandshake className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-2xl tracking-tight">{COMPANY_INFO.name}</span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              منصة رائدة تهدف إلى تمكين العمل الخيري ودعم المشاريع التنموية المستدامة من خلال ربطها بفرص التمويل المناسبة.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">تواصل معنا</h4>
            <div className="flex flex-col space-y-3">
              <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-primary-500" />
                <span dir="ltr" className="text-right">{COMPANY_INFO.email}</span>
              </a>
              <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-primary-500" />
                <span dir="ltr" className="text-right">{COMPANY_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Links/Disclaimer */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">روابط هامة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" onClick={onHomeClick} className="hover:text-primary-400 transition-colors cursor-pointer">عن المبادرة</a></li>
              <li><a href="#eligibility" onClick={onHomeClick} className="hover:text-primary-400 transition-colors cursor-pointer">شروط الأهلية</a></li>
              <li><button onClick={onAdminClick} className="flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer">
                <ShieldEllipsis className="w-4 h-4" />
                بوابة الإدارة (مراجعة الطلبات)
              </button></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-xs opacity-60">تنويه: إرسال النموذج لا يضمن الحصول على التمويل، وإنما يدخل المشروع في مرحلة الفرز والتقييم.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;