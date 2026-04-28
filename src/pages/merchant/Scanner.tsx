import { useState, useEffect, useRef } from "react";
import { QrCode, ShieldCheck, History, Search, CheckCircle2, XCircle, Clock, TrendingUp, AlertCircle, Download, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../../api/client";

export default function MerchantScanner() {
  const [couponHash, setCouponHash] = useState("");
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; deal?: any; customer?: string; timestamp?: string } | null>(null);
  const [recentRedemptions, setRecentRedemptions] = useState<any[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [todayStats, setTodayStats] = useState({ count: 0, volume: 0 });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadHistory();
    // Poll for new redemptions every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      loadHistory();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const calculateTodayStats = (redemptions: any[]) => {
    const today = new Date().toDateString();
    const todayRedemptions = redemptions.filter(r => new Date(r.redeemed_at || r.timestamp).toDateString() === today);
    setTodayStats({
      count: todayRedemptions.length,
      volume: todayRedemptions.reduce((sum, r) => sum + (r.revenue || 0), 0)
    });
  };

  const loadHistory = async () => {
    try {
      const data = await apiClient("/merchants/redemption-log");
      setRecentRedemptions(data);
      calculateTodayStats(data);
    } catch (error) {
      console.error("Failed to load redemption history:", error);
    }
  };

  const formatCode = (val: string) => {
    const raw = val.replace(/[^A-Za-z0-9]/g, "").slice(0, 12).toUpperCase();
    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
        if (i === 4 || i === 8) {
            formatted += "-";
        }
        formatted += raw[i];
    }
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponHash(formatCode(e.target.value));
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponHash.trim()) return;

    setIsValidating(true);
    try {
      const result = await apiClient("/vouchers/redeem", {
        method: "POST",
        body: JSON.stringify({ voucher_code: couponHash.trim().toUpperCase() })
      });
      
      setValidationResult({ 
        success: true, 
        message: result.message, 
        customer: result.voucher?.users?.name || "Anonymous Customer",
        timestamp: new Date().toLocaleTimeString(),
        deal: {
          title: result.voucher.deals?.title,
          image: result.voucher.deals?.images?.[0] || "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
        } 
      });
      setCouponHash("");
      loadHistory();
      // Play success sound
      playNotificationSound('success');
    } catch (error: any) {
      setValidationResult({ 
        success: false, 
        message: error.message || "Invalid Voucher Code",
        timestamp: new Date().toLocaleTimeString()
      });
      // Play error sound
      playNotificationSound('error');
    } finally {
      setIsValidating(false);
    }
  };

  const playNotificationSound = (type: 'success' | 'error') => {
    // Using Web Audio API for cross-browser support
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.value = 400;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const handleExportAudit = () => {
    if (recentRedemptions.length === 0) {
      alert("No redemptions to export");
      return;
    }

    const headers = ["Voucher Code", "Customer", "Deal", "Time", "Status"];
    const rows = recentRedemptions.map(r => [
      r.id,
      r.customer,
      r.deal,
      r.time,
      r.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `slasham_terminal_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-600 rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/20 mb-6">
            <QrCode className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Terminal Console</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">Secure real-time voucher verification and redemption management</p>
        </div>

        {/* Statistics Panel */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Redemptions Today</p>
                <h3 className="text-3xl font-black text-emerald-900">{todayStats.count}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <Zap size={24} className="text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-br from-yellow-50 to-yellow-100/50 rounded-3xl p-6 border border-yellow-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1">Volume</p>
                <h3 className="text-3xl font-black text-yellow-900">₦{(todayStats.volume / 1000).toFixed(0)}K</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Terminal Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-3 space-y-8">
          {/* Scanner Input Form */}
          <form onSubmit={handleValidate} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block px-2">Verification Protocol</label>
                <div className="relative">
                  <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isValidating ? 'text-emerald-500 animate-pulse' : 'text-slate-300'}`} size={24} />
                  <input 
                    type="text"
                    value={couponHash}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="SLSH-XXXX-XXXX"
                    autoFocus
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xl font-black tracking-widest text-slate-900 placeholder:text-slate-200 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 outline-none transition-all uppercase"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isValidating || !couponHash.trim()}
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  isValidating 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-yellow-400 text-black hover:bg-black hover:text-white shadow-yellow-400/20'
                }`}
              >
                {isValidating ? (
                  <>
                    <Clock className="animate-spin" size={20} /> Querying Database...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} /> Verify Voucher
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Validation Feedback with Enhanced Details */}
          <AnimatePresence mode="wait">
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`p-8 rounded-4xl border flex flex-col text-center gap-6 ${
                  validationResult.success 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                    : 'bg-rose-50 border-rose-100 text-rose-900'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 ${
                      validationResult.success ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-rose-600 text-white shadow-rose-500/20'
                    }`}>
                      {validationResult.success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tight">{validationResult.success ? "Clearance Authorized" : "Verification Failed"}</h3>
                      <p className="text-sm font-medium opacity-70 uppercase tracking-widest">{validationResult.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(true)}
                    className="text-[10px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors"
                  >
                    Details
                  </button>
                </div>

                {validationResult.success && validationResult.deal && (
                  <>
                    <div className="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/20 flex flex-col md:flex-row items-center gap-6 text-left">
                      {validationResult.deal.image && <img src={validationResult.deal.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt="" />}
                      <div className="space-y-2 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Asset</p>
                        <h4 className="text-xl font-black leading-tight">{validationResult.deal.title}</h4>
                        {validationResult.customer && (
                          <p className="text-sm font-bold opacity-70">Customer: {validationResult.customer}</p>
                        )}
                        {validationResult.timestamp && (
                          <p className="text-[10px] font-mono opacity-50">{validationResult.timestamp}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <button 
                  onClick={() => setValidationResult(null)}
                  className="py-3 bg-white/20 hover:bg-white/40 transition-colors rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Clear Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ledger History Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger History</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black tracking-widest">LIVE</span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentRedemptions.length === 0 ? (
                <div className="py-20 text-center space-y-3 opacity-40">
                  <Clock size={32} className="mx-auto" />
                  <p className="text-xs font-black uppercase tracking-widest italic">Waiting for queries...</p>
                </div>
              ) : (
                recentRedemptions.map((red, i) => (
                  <motion.div 
                    key={red.id + i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setSelectedDetail(red);
                      setShowDetailModal(true);
                    }}
                    className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 rounded-2xl border border-slate-100 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                        <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-widest">{red.deal}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <p className="text-[10px] font-bold text-slate-400 font-mono">{red.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-900 opacity-30">{red.time}</p>
                      <ShieldCheck className="text-emerald-500 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" size={14} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <button 
              onClick={handleExportAudit}
              className="w-full mt-6 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} /> Export Validation Audit
            </button>
          </div>

          {/* Fraud Prevention Info */}
          <div className="p-8 bg-black rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 -mr-20 -mt-20 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-4">
              <div className="w-10 h-10 bg-yellow-400/20 text-yellow-400 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <h4 className="text-lg font-black uppercase tracking-widest leading-tight text-white">Fraud Prevention</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">Every transaction is logged in real-time. Suspicious patterns are automatically flagged and stored for compliance audit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (selectedDetail || validationResult) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-4xl p-8 max-w-md w-full space-y-6 shadow-2xl"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Transaction Details</h2>
                <p className="text-sm text-slate-500">Complete verification record</p>
              </div>

              <div className="space-y-4 bg-slate-50 rounded-3xl p-6">
                {selectedDetail && (
                  <>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Voucher Code</p>
                      <p className="text-lg font-bold text-slate-900 font-mono">{selectedDetail.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer</p>
                      <p className="text-lg font-bold text-slate-900">{selectedDetail.customer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deal</p>
                      <p className="text-lg font-bold text-slate-900">{selectedDetail.deal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time</p>
                      <p className="text-lg font-bold text-slate-900">{selectedDetail.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                      <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black">{selectedDetail.status}</span>
                    </div>
                  </>
                )}
                {validationResult && !selectedDetail && (
                  <>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-black ${
                        validationResult.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {validationResult.success ? 'Authorized' : 'Failed'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Message</p>
                      <p className="text-lg font-bold text-slate-900">{validationResult.message}</p>
                    </div>
                    {validationResult.customer && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer</p>
                        <p className="text-lg font-bold text-slate-900">{validationResult.customer}</p>
                      </div>
                    )}
                    {validationResult.deal && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deal</p>
                        <p className="text-lg font-bold text-slate-900">{validationResult.deal.title}</p>
                      </div>
                    )}
                    {validationResult.timestamp && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Timestamp</p>
                        <p className="text-lg font-bold text-slate-900">{validationResult.timestamp}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
