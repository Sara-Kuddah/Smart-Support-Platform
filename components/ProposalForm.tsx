
import React, { useState, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, Send, Building2, 
  ClipboardList, Sparkles, Wand2, ChevronDown, ChevronUp,
  Check, Edit3, MessageSquareText
} from 'lucide-react';
import { proposalService } from '../services/proposalService';
import { GoogleGenAI, Type } from "@google/genai";

interface ProposalFormProps {
  onBack: () => void;
}

interface AISuggestion {
  field: string;
  issue: string;
  suggestion: string;
  improvedText: string;
}

interface AIFeedback {
  summary: string;
  suggestions: AISuggestion[];
}

const FIELD_LABELS: Record<string, string> = {
  projectTitle: 'عنوان المشروع',
  projectDesc: 'وصف المشروع',
  beneficiaries: 'الفئات المستهدفة',
  fundingAmount: 'المبلغ المطلوب',
  budgetBreakdown: 'تفاصيل الميزانية',
  expectedOutcomes: 'المخرجات والأثر'
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5 md:space-y-2">
    <label className="text-xs md:text-sm font-bold text-slate-700 pr-1">{label}</label>
    {children}
  </div>
);

const ProposalForm: React.FC<ProposalFormProps> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(true);
  
  const [formData, setFormData] = useState({
    entityType: 'non-profit',
    entityName: '',
    licenseNumber: '',
    issuingAuthority: '',
    city: '',
    email: '',
    mobile: '',
    responsibleName: '',
    nationalId: '',
    projectTitle: '',
    projectDesc: '',
    beneficiaries: '',
    location: '',
    duration: '',
    fundingAmount: '',
    budgetBreakdown: '',
    expectedOutcomes: ''
  });

  const formRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const performAIAnalysis = async () => {
    if (!formData.projectTitle || !formData.projectDesc) {
      alert("الرجاء إدخال عنوان المشروع ووصفه أولاً للحصول على المراجعة.");
      return;
    }

    setAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyAVO-30qMLZr1IfYdziTExIi5I4wk8uC_o" });
      
      const prompt = `أنت خبير في تقييم المشاريع الخيرية. قم بمراجعة هذا المقترح وتقديم تقييم فني وقائمة من الاقتراحات المحددة والقابلة للتنفيذ لزيادة فرص القبول.
      العنوان: ${formData.projectTitle}
      الوصف: ${formData.projectDesc}
      الميزانية: ${formData.fundingAmount} ريال
      الفئة: ${formData.beneficiaries}
      الميزانية التفصيلية: ${formData.budgetBreakdown}
      الأثر المتوقع: ${formData.expectedOutcomes}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "A brief professional summary." },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    field: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    improvedText: { type: Type.STRING }
                  },
                  required: ["field", "issue", "suggestion", "improvedText"]
                }
              }
            },
            required: ["summary", "suggestions"]
          }
        },
      });

      if (response.text) {
        const feedback = JSON.parse(response.text) as AIFeedback;
        setAiFeedback(feedback);
        setIsFeedbackExpanded(true);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. يرجى التأكد من إعداد مفتاح API بشكل صحيح.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    setFormData(prev => ({
      ...prev,
      [suggestion.field]: suggestion.improvedText
    }));
    
    if (aiFeedback) {
      setAiFeedback({
        ...aiFeedback,
        suggestions: aiFeedback.suggestions.filter(s => s !== suggestion)
      });
    }
  };

  const handleModifySuggestion = (field: string) => {
    const el = formRefs.current[field];
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declared) return;
    setLoading(true);
    try {
      const savedProposal = await proposalService.saveProposal(formData);
      if (aiFeedback) {
        await proposalService.updateAIReview(savedProposal.id, aiFeedback.summary);
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("حدث خطأ أثناء حفظ الطلب.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center bg-white p-10 rounded-3xl shadow-2xl border border-primary-50">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">تم الاستلام بنجاح</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            تم حفظ بيانات المقترح بنجاح، وسنقوم بمراجعة طلبكم قريباً.
          </p>
          <button onClick={onBack} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-bold">
          <ArrowRight className="w-5 h-5" />
          رجوع
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-primary-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-1">تقديم مقترح مشروع</h1>
            <p className="text-primary-100 opacity-90">املأ البيانات بدقة لزيادة فرص قبول مشروعك.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-slate-800">بيانات الجهة المقدمة</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="نوع الجهة *">
                  <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="input-field">
                    <option value="non-profit">منظمة غير ربحية / جمعية أهلية</option>
                    <option value="volunteer">فريق تطوعي</option>
                  </select>
                </FormGroup>
                <FormGroup label="اسم الجهة *">
                  <input required name="entityName" value={formData.entityName} onChange={handleInputChange} type="text" className="input-field" placeholder="الاسم الرسمي" />
                </FormGroup>
                <FormGroup label="رقم الترخيص *">
                  <input required name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} type="text" className="input-field" placeholder="مثال: 1234" />
                </FormGroup>
                <FormGroup label="المدينة *">
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="input-field" placeholder="مقر التنفيذ" />
                </FormGroup>
                <FormGroup label="البريد الرسمي *">
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="input-field" placeholder="email@org.sa" />
                </FormGroup>
                <FormGroup label="رقم الجوال *">
                  <input required name="mobile" value={formData.mobile} onChange={handleInputChange} type="tel" className="input-field" placeholder="05xxxxxxxx" />
                </FormGroup>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold text-slate-800">تفاصيل المشروع</h2>
              </div>
              <div className="space-y-6">
                <input required name="projectTitle" ref={el => { formRefs.current['projectTitle'] = el; }} value={formData.projectTitle} onChange={handleInputChange} className="input-field" placeholder="عنوان المشروع *" />
                <textarea required name="projectDesc" ref={el => { formRefs.current['projectDesc'] = el; }} value={formData.projectDesc} onChange={handleInputChange} rows={3} className="input-field" placeholder="وصف المشروع *" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input required name="beneficiaries" ref={el => { formRefs.current['beneficiaries'] = el; }} value={formData.beneficiaries} onChange={handleInputChange} className="input-field" placeholder="الفئات المستهدفة *" />
                   <input required name="fundingAmount" ref={el => { formRefs.current['fundingAmount'] = el; }} value={formData.fundingAmount} onChange={handleInputChange} type="number" className="input-field" placeholder="المبلغ المطلوب (ريال) *" />
                </div>
                <textarea required name="budgetBreakdown" ref={el => { formRefs.current['budgetBreakdown'] = el; }} value={formData.budgetBreakdown} onChange={handleInputChange} rows={2} className="input-field" placeholder="تفاصيل الميزانية التقديرية *" />
                <textarea required name="expectedOutcomes" ref={el => { formRefs.current['expectedOutcomes'] = el; }} value={formData.expectedOutcomes} onChange={handleInputChange} rows={2} className="input-field" placeholder="المخرجات والأثر المتوقع *" />
              </div>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-3xl bg-slate-50 transition-all">
              <div className={`p-8 bg-slate-900 text-white relative flex items-center justify-between cursor-pointer ${aiFeedback ? '' : 'pointer-events-none'}`} onClick={() => aiFeedback && setIsFeedbackExpanded(!isFeedbackExpanded)}>
                <Sparkles className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary-400" />
                    المراجعة الذكية الفورية
                  </h3>
                  <p className="text-slate-400 text-sm">احصل على ملاحظات تحسينية لمشروعك قبل الإرسال.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  {!aiFeedback && (
                    <button type="button" disabled={analyzing} onClick={(e) => { e.stopPropagation(); performAIAnalysis(); }} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all disabled:opacity-50">
                      {analyzing ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> : <>تحليل المقترح <Sparkles className="w-4 h-4" /></>}
                    </button>
                  )}
                  {aiFeedback && (
                    <div className="bg-white/10 p-2 rounded-lg">
                      {isFeedbackExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>
              </div>

              {aiFeedback && isFeedbackExpanded && (
                <div className="p-8 space-y-8 animate-in slide-in-from-top-4">
                  <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100">
                    <p className="text-primary-800 text-sm font-bold flex items-center gap-2 mb-2">
                      <MessageSquareText className="w-4 h-4" />
                      ملخص التقييم:
                    </p>
                    <p className="text-slate-700 text-sm italic">{aiFeedback.summary}</p>
                  </div>

                  <div className="space-y-4">
                    {aiFeedback.suggestions.map((s, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{FIELD_LABELS[s.field] || s.field}</span>
                            <p className="text-slate-900 font-bold text-sm">{s.issue}</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleAcceptSuggestion(s)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all">قبول</button>
                            <button type="button" onClick={() => handleModifySuggestion(s.field)} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">تعديل</button>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border-r-4 border-primary-500">
                          <p className="text-slate-700 text-sm leading-relaxed">{s.improvedText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100 flex items-start gap-3">
              <input id="declaration" type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} className="mt-1 w-5 h-5 cursor-pointer accent-primary-600" />
              <label htmlFor="declaration" className="text-sm font-medium text-slate-700 cursor-pointer">
                أقر بصحة المعلومات الواردة في هذا النموذج. *
              </label>
            </div>

            <button disabled={loading || !declared} type="submit" className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white py-5 rounded-2xl text-xl font-bold transition-all transform active:scale-[0.98]">
              {loading ? <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <>إرسال المقترح <Send className="w-5 h-5 rtl:rotate-180" /></>}
            </button>
          </form>
        </div>
      </div>
      
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .input-field:focus {
          border-color: #14b8a6;
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.1);
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default ProposalForm;
