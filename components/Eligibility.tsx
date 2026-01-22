import React from 'react';
import { CheckCircle2, FileCheck } from 'lucide-react';

const REQUIREMENTS = [
  "أن تكون الجهة مسجلة رسمياً ولديها ترخيص ساري المفعول.",
  "وجود حساب بنكي رسمي باسم الجهة.",
  "تقديم مقترح فني ومالي واضح للمشروع.",
  "القدرة على توفير تقارير دورية عن سير العمل وصرف الميزانية.",
  "أن يخدم المشروع فئة مجتمعية محددة واحتياجاً قائماً.",
  "وجود هيكل إداري قادر على تنفيذ المشروع بكفاءة."
];

const Eligibility: React.FC = () => {
  return (
    <section id="eligibility" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/30 transform skew-x-12 translate-x-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-900/50 border border-primary-700/50 rounded-full px-4 py-1.5 mb-6">
              <FileCheck className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-200">معايير القبول</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              هل منظمتكم مؤهلة للحصول على الدعم؟
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              لضمان الجودة والامتثال، قمنا بتحديد مجموعة من المعايير الأساسية التي يجب توفرها في الجهات المتقدمة والمشاريع المقترحة.
            </p>
            
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-xl text-white mb-2">تنويه هام</h4>
                <p className="text-slate-400">
                    تقديم الطلب لا يعني القبول النهائي، حيث تخضع جميع الطلبات للمفاضلة بناءً على الأولويات الاستراتيجية وحجم الميزانية المتاحة.
                </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/20 text-slate-800">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 border-b pb-4">المستندات والمتطلبات الأساسية</h3>
            <ul className="space-y-5">
              {REQUIREMENTS.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-700 leading-snug">{req}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Eligibility;
