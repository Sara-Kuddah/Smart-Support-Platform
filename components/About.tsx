import React from 'react';
import { ShieldCheck, Target, Users } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    icon: Target,
    title: "تركيز على الأثر",
    description: "نبحث عن المشاريع التي تحقق أثراً مستداماً وواقعياً في حياة المستفيدين والمجتمع."
  },
  {
    icon: ShieldCheck,
    title: "عدالة وشفافية",
    description: "تخضع جميع المقترحات لعملية تقييم دقيقة ومحايدة لضمان وصول الدعم للمشاريع الأكثر استحقاقاً."
  },
  {
    icon: Users,
    title: "شراكة مجتمعية",
    description: "نؤمن بأن العمل الخيري جهد تكاملي، ونسعى لتمكين الجهات الفاعلة في القطاع غير الربحي."
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">عن المبادرة</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">ندعم الطموح لخدمة المجتمع</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            مبادرة مخصصة لربط المانحين بالمشاريع التنموية والخيرية ذات الجدوى العالية. نحن نعمل كجسر موثوق لضمان توجيه التبرعات والمنح للمبادرات التي تصنع فارقاً حقيقياً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-primary-600">
                <feature.icon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
