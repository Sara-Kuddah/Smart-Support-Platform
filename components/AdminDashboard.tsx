import React, { useState, useEffect } from 'react';
import { proposalService } from '../services/proposalService';
import { Proposal } from '../types';
import { supabase } from '../lib/supabase';
import { 
  Search, Trash2, CheckCircle, 
  XCircle, Calendar, Sparkles,
  ChevronLeft, LayoutDashboard, Building, MapPin,
  LogOut, TrendingUp, Inbox, CheckCircle2, AlertCircle, FileSpreadsheet,
  RotateCw, ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onLogout }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Controls visibility on mobile (small screens)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await proposalService.getProposals();
      setProposals(data);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();

    const channel = supabase
      .channel('proposals-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        () => {
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    approved: proposals.filter(p => p.status === 'approved').length,
    totalFunding: proposals.reduce((acc, p) => acc + (Number(p.fundingAmount) || 0), 0)
  };

  const handleProposalSelect = (p: Proposal) => {
    setSelectedProposal(p);
    setIsMobileDetailOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusUpdate = async (id: string, status: Proposal['status']) => {
    try {
      await proposalService.updateStatus(id, status);
      await fetchProposals();
      if (selectedProposal && selectedProposal.id === id) {
        // Fetch specific updated proposal if needed, or just update local state
        const updated = await proposalService.getProposals();
        setSelectedProposal(updated.find(p => p.id === id) || null);
      }
    } catch (err) {
      alert("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await proposalService.deleteProposal(id);
        await fetchProposals();
        setSelectedProposal(null);
        setIsMobileDetailOpen(false);
      } catch (err) {
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = (p.entityName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 min-h-[5rem] flex items-center sticky top-0 z-40 px-4 md:px-6">
        <div className="max-w-[1600px] w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary-600 p-1.5 md:p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-xl text-slate-900 leading-tight">لوحة تحكم المنصة</h1>
              <p className="text-[10px] md:text-xs text-slate-500 hidden sm:block">نظام المراجعة والفرز الذكي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={onBack}
              className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              الموقع الرئيسي
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 md:gap-2 bg-red-50 text-red-600 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">تسجيل الخروج</span>
              <span className="xs:hidden">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 space-y-6 md:y-8 flex-1">
        
        {/* KPI Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard icon={Inbox} color="blue" label="الطلبات" value={stats.total} />
          <StatCard icon={AlertCircle} color="amber" label="بانتظارنا" value={stats.pending} />
          <StatCard icon={CheckCircle2} color="green" label="مقبولة" value={stats.approved} />
          <StatCard icon={TrendingUp} color="primary" label="التمويل" value={stats.totalFunding.toLocaleString()} isCurrency />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Sidebar / List */}
          <div className={`${isMobileDetailOpen ? 'hidden' : 'block'} lg:block lg:col-span-4 xl:col-span-3 space-y-4`}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px] lg:h-[700px]">
              <div className="p-4 md:p-5 border-b border-slate-50 space-y-3 bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="بحث..."
                      className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={fetchProposals}
                    disabled={isLoading}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <RotateCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                        statusFilter === status 
                        ? 'bg-primary-600 text-white shadow-md' 
                        : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      {status === 'all' ? 'الكل' : status === 'pending' ? 'جديد' : status === 'approved' ? 'مقبول' : 'مرفوض'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-3 custom-scrollbar">
                {isLoading && proposals.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                      <span className="text-slate-400 text-xs font-medium">تحميل...</span>
                   </div>
                ) : filteredProposals.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-sm italic">لا توجد نتائج</div>
                ) : (
                  filteredProposals.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleProposalSelect(p)}
                      className={`w-full text-right p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                        selectedProposal?.id === p.id 
                        ? 'bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-100' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                          p.status === 'approved' ? 'bg-green-100 text-green-700' :
                          p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status === 'pending' ? 'جديد' : p.status === 'approved' ? 'مقبول' : 'مرفوض'}
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(p.submittedAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm mb-1 leading-snug line-clamp-2">{p.projectTitle}</h4>
                      <p className="text-slate-500 text-[10px] md:text-xs truncate">{p.entityName}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className={`${isMobileDetailOpen ? 'block' : 'hidden'} lg:block lg:col-span-8 xl:col-span-9`}>
            {selectedProposal ? (
              <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-left-4 duration-300">
                
                {/* Header Section */}
                <div className="p-5 md:p-8 border-b border-slate-50 bg-slate-50/30">
                  <button 
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="lg:hidden flex items-center gap-2 text-primary-600 font-bold mb-4 text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة للقائمة
                  </button>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-[10px] font-bold bg-white text-primary-600 border border-primary-200 px-2 py-0.5 rounded-md">ID: {selectedProposal.id.substring(0,8)}</span>
                          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">{selectedProposal.projectTitle}</h2>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-600 font-bold">
                          <Building className="w-4 h-4 text-primary-500" />
                          {selectedProposal.entityName}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          {selectedProposal.city}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 justify-center">
                      <ActionButton 
                        active={selectedProposal.status === 'approved'} 
                        onClick={() => handleStatusUpdate(selectedProposal.id, 'approved')}
                        color="green" 
                        icon={CheckCircle} 
                      />
                      <ActionButton 
                        active={selectedProposal.status === 'rejected'} 
                        onClick={() => handleStatusUpdate(selectedProposal.id, 'rejected')}
                        color="red" 
                        icon={XCircle} 
                      />
                      <div className="w-px bg-slate-100 mx-1"></div>
                      <ActionButton 
                        onClick={() => handleDelete(selectedProposal.id)}
                        color="slate" 
                        icon={Trash2} 
                        isDestructive
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-12 space-y-10">
                  
                  {/* AI Analysis Card */}
                  {selectedProposal.aiReview && (
                    <div className="p-6 md:p-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl md:rounded-3xl text-white relative overflow-hidden shadow-lg shadow-primary-600/10">
                      <Sparkles className="absolute -bottom-8 -left-8 w-32 h-32 opacity-10" />
                      <div className="relative z-10">
                        <h4 className="font-bold text-base md:text-lg mb-3 flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-primary-200" />
                          تقييم الذكاء الاصطناعي الفني
                        </h4>
                        <p className="text-primary-50 text-sm md:text-lg leading-relaxed italic pr-4 border-r-2 border-white/20">
                          {selectedProposal.aiReview}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                      <h4 className="text-slate-900 font-bold text-sm md:text-base flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Inbox className="w-4 h-4 text-primary-500" />
                        البيانات التشغيلية
                      </h4>
                      <div className="space-y-2.5">
                        <DetailRow label="الكيان" value={selectedProposal.entityType === 'volunteer' ? 'فريق تطوعي' : 'منظمة خيرية'} />
                        <DetailRow label="رقم الترخيص" value={selectedProposal.licenseNumber} />
                        <DetailRow label="المسؤول" value={selectedProposal.responsibleName} />
                        <DetailRow label="التواصل" value={selectedProposal.mobile} />
                        <DetailRow label="البريد" value={selectedProposal.email} isLtr />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-slate-900 font-bold text-sm md:text-base flex items-center gap-2 border-b border-slate-100 pb-2">
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                        معطيات المشروع
                      </h4>
                      <div className="space-y-2.5">
                        <DetailRow label="المبلغ" value={`${Number(selectedProposal.fundingAmount).toLocaleString()} ر.س`} isBold />
                        <DetailRow label="المدة" value={selectedProposal.duration} />
                        <DetailRow label="الفئة" value={selectedProposal.beneficiaries} />
                        <DetailRow label="الموقع" value={selectedProposal.location} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <TextSection title="وصف المشروع" content={selectedProposal.projectDesc} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextSection title="الميزانية" content={selectedProposal.budgetBreakdown} isCompact />
                        <TextSection title="الأثر" content={selectedProposal.expectedOutcomes} isCompact />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] lg:min-h-[700px] bg-white rounded-3xl shadow-sm border border-slate-100 border-dashed flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <LayoutDashboard className="w-16 h-16 opacity-5 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">اختر طلباً للمراجعة</h3>
                <p className="text-sm max-w-xs mx-auto">سيتم عرض كافة تفاصيل المشروع والمستندات المرفقة هنا.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, value, isCurrency }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    primary: 'bg-primary-50 text-primary-600'
  };
  return (
    <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4 transition-transform active:scale-[0.98]">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs font-medium text-slate-500 truncate">{label}</p>
        <h3 className="text-sm md:text-xl font-bold text-slate-900 truncate">
          {value}{isCurrency && <span className="text-[10px] md:text-xs mr-1">ر.س</span>}
        </h3>
      </div>
    </div>
  );
};

const ActionButton = ({ active, onClick, color, icon: Icon, isDestructive }: any) => {
  const activeStyles: any = {
    green: 'bg-green-600 text-white shadow-lg shadow-green-200',
    red: 'bg-red-600 text-white shadow-lg shadow-red-200',
    slate: 'bg-slate-800 text-white shadow-lg'
  };
  const baseStyles: any = {
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    slate: 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-3 md:p-3.5 rounded-xl transition-all active:scale-90 flex-1 md:flex-none flex items-center justify-center ${active ? activeStyles[color] : baseStyles[color]}`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
};

const DetailRow = ({ label, value, isLtr, isBold }: { label: string, value: any, isLtr?: boolean, isBold?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50/50">
    <span className="text-slate-400 text-[10px] md:text-xs whitespace-nowrap">{label}</span>
    <span className={`text-slate-800 truncate px-2 ${isBold ? 'font-bold text-xs md:text-sm' : 'font-medium text-xs'} ${isLtr ? 'text-left font-sans' : ''}`} dir={isLtr ? 'ltr' : 'rtl'}>
      {value}
    </span>
  </div>
);

const TextSection = ({ title, content, isCompact }: { title: string, content: string, isCompact?: boolean }) => (
  <div className="space-y-3">
    <h4 className="text-slate-900 font-bold text-sm md:text-base">{title}</h4>
    <div className={`bg-slate-50 p-4 md:p-6 rounded-2xl text-slate-600 leading-relaxed whitespace-pre-wrap border border-slate-100 ${isCompact ? 'text-[11px] md:text-sm' : 'text-xs md:text-base'}`}>
      {content || 'لا يوجد تفاصيل إضافية'}
    </div>
  </div>
);

export default AdminDashboard;