
import React, { useState, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, Send, Building2, 
  ClipboardList, Sparkles, Wand2, ChevronDown, ChevronUp,
  Check, Edit3, MessageSquareText, AlertTriangle
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
      // Create fresh instance right before call as per guidelines
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
              summary: { type: Type.STRING, description: "A brief professional summary of the proposal's strengths and weaknesses." },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    field: { 
                      type: Type.STRING, 
                      description: "The technical field name to improve (must be one of: projectTitle, projectDesc, beneficiaries, fundingAmount, budgetBreakdown, expectedOutcomes)" 
                    },
                    issue: { type: Type.STRING, description: "What is the problem with the current text?" },
                    suggestion: { type: Type.STRING, description: "Explanation of how to improve it." },
                    improvedText: { type: Type.STRING, description: "A concrete rewritten version of the field content that follows best practices for charity grants." }
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
    } catch (error: any) {
      console.error("AI Analysis failed:", error);
      
      // If error is about API key, prompt user to select one
      if (error.message?.includes("API Key") || error.message?.includes("entity was not found")) {
        if (window.confirm("يبدو أن هناك مشكلة في مفتاح الوصول (API Key). هل تود إعادة اختيار المفتاح؟")) {
          try {
            await (window as any).aistudio.openSelectKey();
          } catch (e) {
            console.error("Selector failed", e);
          }
        }
      } else {
        alert("تعذر الحصول على تحليل الذكاء الاصطناعي حالياً. يرجى المحاولة لاحقاً.");
      }
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
      alert("حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.");
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
        <div className="max-w-2xl w-full text-center bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-primary-50 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">تم الاستلام بنجاح</h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base">
            تم حفظ بيانات المقترح في قاعدة بياناتنا بنجاح، وسنقوم بمراجعة طلبكم قريباً.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              العودة للرئيسية
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 min-h-screen bg-slate-50 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 md:mb-8 font-bold transition-colors outline-none"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          رجوع
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          <div className="bg-primary-600 p-6 md:p-8 text-white relative">
            <h1 className="text-xl md:text-3xl font-bold mb-1">تقديم مقترح مشروع</h1>
            <p className="text-primary-100 opacity-90 text-xs md:text-sm">املأ البيانات بدقة لزيادة فرص قبول مشروعك.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 md:p-12 space-y-10 md:space-y-12">
            
            {/* Section A */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg md:text-xl font-bold text-slate-800">بيانات الجهة المقدمة</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                <FormGroup label="جهة الإصدار *">
                  <input required name="issuingAuthority" value={formData.issuingAuthority} onChange={handleInputChange} type="text" className="input-field" placeholder="جهة الإصدار" />
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
                <FormGroup label="اسم المسؤول *">
                  <input required name="responsibleName" value={formData.responsibleName} onChange={handleInputChange} type="text" className="input-field" placeholder="الاسم الرباعي" />
                </FormGroup>
              </div>
            </div>

            {/* Section C */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg md:text-xl font-bold text-slate-800">تفاصيل المشروع</h2>
              </div>
              <div className="space-y-4 md:y-6">
                <input 
                  required 
                  name="projectTitle" 
                  ref={el => { formRefs.current['projectTitle'] = el; }}
                  value={formData.projectTitle} 
                  onChange={handleInputChange} 
                  className="input-field" 
                  placeholder="عنوان المشروع *" 
                />
                <textarea 
                  required 
                  name="projectDesc" 
                  ref={el => { formRefs.current['projectDesc'] = el; }}
                  value={formData.projectDesc} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="input-field" 
                  placeholder="وصف المشروع *" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <input 
                    required 
                    name="beneficiaries" 
                    ref={el => { formRefs.current['beneficiaries'] = el; }}
                    value={formData.beneficiaries} 
                    onChange={handleInputChange} 
                    className="input-field" 
                    placeholder="الفئات المستهدفة *" 
                   />
                   <input required name="location" value={formData.location} onChange={handleInputChange} className="input-field" placeholder="مقر التنفيذ *" />
                   <input required name="duration" value={formData.duration} onChange={handleInputChange} className="input-field" placeholder="المدة المتوقعة *" />
                   <input 
                    required 
                    name="fundingAmount" 
                    ref={el => { formRefs.current['fundingAmount'] = el; }}
                    value={formData.fundingAmount} 
                    onChange={handleInputChange} 
                    type="number" 
                    className="input-field" 
                    placeholder="المبلغ المطلوب (ريال) *" 
                   />
                </div>
                <textarea 
                  required 
                  name="budgetBreakdown" 
                  ref={el => { formRefs.current['budgetBreakdown'] = el; }}
                  value={formData.budgetBreakdown} 
                  onChange={handleInputChange} 
                  rows={2} 
                  className="input-field" 
                  placeholder="تفاصيل الميزانية التقديرية *" 
                />
                <textarea 
                  required 
                  name="expectedOutcomes" 
                  ref={el => { formRefs.current['expectedOutcomes'] = el; }}
                  value={formData.expectedOutcomes} 
                  onChange={handleInputChange} 
                  rows={2} 
                  className="input-field" 
                  placeholder="المخرجات والأثر المتوقع *" 
                />
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="overflow-hidden border border-slate-200 rounded-3xl bg-slate-50 transition-all">
              <div 
                className={`p-6 md:p-8 bg-slate-900 text-white relative flex items-center justify-between cursor-pointer ${aiFeedback ? '' : 'pointer-events-none'}`}
                onClick={() => aiFeedback && setIsFeedbackExpanded(!isFeedbackExpanded)}
              >
                <Sparkles className="absolute -bottom-6 -left-6 w-24 h-24 md:w-32 md:h-32 opacity-10" />
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary-400" />
                    المراجعة الذكية الفورية
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm">احصل على ملاحظات تحسينية لمشروعك قبل الإرسال.</p>
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  {!aiFeedback && (
                    <button 
                      type="button"
                      disabled={analyzing}
                      onClick={(e) => { e.stopPropagation(); performAIAnalysis(); }}
                      className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all disabled:opacity-50 active:scale-95 text-sm md:text-base"
                    >
                      {analyzing ? (
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                      ) : (
                        <>تحليل المقترح <Sparkles className="w-4 h-4" /></>
                      )}
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
                <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100">
                    <p className="text-primary-800 text-sm font-bold flex items-center gap-2 mb-2">
                      <MessageSquareText className="w-4 h-4" />
                      ملخص التقييم:
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed italic">{aiFeedback.summary}</p>
                  </div>

                  {aiFeedback.suggestions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-slate-800 font-bold text-sm">اقتراحات التحسين المحددة ({aiFeedback.suggestions.length}):</h4>
                      <div className="space-y-4">
                        {aiFeedback.suggestions.map((s, idx) => (
                          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{FIELD_LABELS[s.field] || s.field}</span>
                                <p className="text-slate-900 font-bold text-sm">{s.issue}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptSuggestion(s)}
                                  className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                  title="تطبيق التعديل المقترح"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  قبول
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleModifySuggestion(s.field)}
                                  className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all shadow-sm"
                                  title="الذهاب للحقل للتعديل يدوياً"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  تعديل
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-slate-50 rounded-xl border-r-4 border-primary-500">
                              <p className="text-xs text-slate-500 mb-1 font-medium italic">النص المقترح:</p>
                              <p className="text-slate-700 text-sm leading-relaxed">{s.improvedText}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiFeedback.suggestions.length === 0 && (
                    <div className="text-center py-6 text-slate-400 italic text-sm">
                      تم تطبيق كافة الاقتراحات المقترحة أو لا توجد ملاحظات إضافية حالياً.
                    </div>
                  )}
                  
                  <div className="flex justify-center pt-2">
                    <button 
                      type="button"
                      disabled={analyzing}
                      onClick={performAIAnalysis}
                      className="text-primary-600 text-sm font-bold flex items-center gap-2 hover:underline"
                    >
                      {analyzing ? <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div> : <><Sparkles className="w-4 h-4" /> إعادة التحليل بناءً على التعديلات الجديدة</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100">
              <div className="flex items-start gap-3">
                <input id="declaration" type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} className="mt-1 w-5 h-5 cursor-pointer accent-primary-600" />
                <label htmlFor="declaration" className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed cursor-pointer select-none">
                  أقر بصحة المعلومات الواردة في هذا النموذج وبأن الجهة المقدمة قائمة نظاماً، كما أوافق على معالجة هذه البيانات وحفظها. *
                </label>
              </div>
            </div>

            <button disabled={loading || !declared} type="submit" className="w-full flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all transform active:scale-[0.98]">
              {loading ? <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <>إرسال المقترح <Send className="w-5 h-5 md:w-6 md:h-6 rtl:rotate-180" /></>}
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
        @media (max-width: 768px) {
          .input-field {
             padding: 0.75rem;
             font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProposalForm;
