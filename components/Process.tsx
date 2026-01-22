import React from 'react';
import { StepItem } from '../types';
import { Send } from 'lucide-react';

const steps: StepItem[] = [
  {
    number: "01",
    title: "تجهيز المستندات",
    description: "قم بتحضير ملف المشروع والميزانية وكافة الأوراق القانونية المطلوبة بصيغة PDF."
  },
  {
    number: "02",
    title: "تعبئة النموذج",
    description: "انتقل إلى الرابط المخصص وقم بتعبئة البيانات الأساسية عن الجهة والمشروع."
  },
  {
    number: "03",
    title: "إرفاق الملفات",
    description: "ارفع الملفات المطلوبة في الخانات المخصصة داخل النموذج وتأكد من اكتمالها."
  },
  {
    number: "04",
    title: "إرسال وانتظار الرد",
    description: "بعد الإرسال، سيتم مراجعة الطلب وسيصلك إشعار عبر البريد الإلكتروني بحالة الطلب."
  }
];

interface ProcessProps {
  onFormClick: (e: React.MouseEvent) => void;
}

const Process: React.FC<ProcessProps> = ({ onFormClick }) => {
  return (
    <section id="process" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">رحلة التقديم</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">خطوات تقديم الطلب</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-x-1/2"></div>
              )}
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center">
                <p className="text-slate-600 mb-6 text-lg">جاهز للبدء؟ لا تتردد في تقديم مشروعك الآن</p>
                <button
                    onClick={onFormClick}
                    className="animate-bounce-slow inline-flex items-center gap-3 bg-secondary-500 hover:bg-secondary-600 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg shadow-secondary-500/30 transition-all hover:scale-105"
                >
                    <Send className="w-6 h-6 rtl:rotate-180" />
                    تعبئة نموذج الطلب
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Process;