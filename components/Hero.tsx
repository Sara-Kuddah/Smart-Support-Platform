import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface HeroProps {
  onFormClick: (e: React.MouseEvent) => void;
}

const Hero: React.FC<HeroProps> = ({ onFormClick }) => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <svg className="absolute -top-24 -left-24 w-64 lg:w-96 h-64 lg:h-96 text-primary-300" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" />
        </svg>
        <svg className="absolute top-1/2 right-0 w-48 lg:w-64 h-48 lg:h-64 text-secondary-200" fill="currentColor" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="20" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-primary-100 rounded-full px-4 py-1.5 mb-6 lg:mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-secondary-500"></span>
          <span className="text-xs lg:text-sm font-medium text-primary-800">باب التقديم مفتوح الآن</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 lg:mb-6">
          معاً نصنع الأثر.. <br/>
          <span className="text-primary-600">تمويل المشاريع الخيرية</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base lg:text-xl text-slate-600 leading-relaxed px-2">
          ندعو الجمعيات والمؤسسات الخيرية لتقديم مقترحات مشاريع نوعية ومؤهلة للحصول على دعم المانحين، لنساهم سوياً في تنمية المجتمع.
        </p>

        <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <button
            onClick={onFormClick}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary-600/20 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            تقديم مقترح مشروع
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </button>
          
          <a
            href="#eligibility"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-medium transition-colors"
          >
            <FileText className="w-5 h-5 text-slate-500" />
            شروط التقديم
          </a>
        </div>

        {/* Quick Stats/Trust Indicators */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-80">
            <div className="p-2">
                <p className="text-2xl lg:text-3xl font-bold text-primary-700">+50</p>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">مشروع مدعوم</p>
            </div>
            <div className="p-2">
                <p className="text-2xl lg:text-3xl font-bold text-primary-700">شفافية</p>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">في التقييم</p>
            </div>
            <div className="col-span-2 md:col-span-1 p-2">
                <p className="text-2xl lg:text-3xl font-bold text-primary-700">سرعة</p>
                <p className="text-xs lg:text-sm text-slate-500 font-medium">في الإجراءات</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;