import { 
  Ticket, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  Calendar,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  LifeBuoy,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminModal from "../components/AdminModal";

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const [validationCode, setValidationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<any>(null);
  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeForm, setDisputeForm] = useState({ reason: "", description: "" });
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "₦0", change: "0%", icon: <DollarSign size={20} />, color: "black" },
    { label: "Active Deals", value: "0", change: "0", icon: <Ticket size={20} />, color: "yellow" },
    { label: "New Customers", value: "0", change: "0%", icon: <Users size={20} />, color: "emerald" },
    { label: "Total Claims", value: "0", change: "0%", icon: <TrendingUp size={20} />, color: "yellow" },
  ]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profile, liveStats, log] = await Promise.all([
          apiClient("/merchants/my-profile"),
          apiClient("/merchants/stats"),
          apiClient("/merchants/redemption-log")
        ]);

        setMerchant(profile);
        setRedemptions(log);

        if (liveStats && liveStats.totalRevenue > 0) {
          setStats([
            { label: "Total Revenue", value: `₦${liveStats.totalRevenue.toLocaleString()}`, change: "+0%", icon: <DollarSign size={20} />, color: "black" },
            { label: "Active Deals", value: liveStats.activeDeals.toString(), change: liveStats.activeDeals > 0 ? "↑" : "0", icon: <Ticket size={20} />, color: "yellow" },
            { label: "New Customers", value: liveStats.uniqueCustomers.toString(), change: "+0%", icon: <Users size={20} />, color: "emerald" },
            { label: "Total Claims", value: liveStats.totalClaims.toString(), change: "+0%", icon: <TrendingUp size={20} />, color: "yellow" },
          ]);
        }
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient("/merchants/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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
    setValidationCode(formatCode(e.target.value));
  };

  const handleValidation = async () => {
    if (!validationCode) return;
    setIsValidating(true);
    setValidationResult(null);
    try {
      // Assuming a backend route exists for this, e.g., POST /vouchers/validate
      await apiClient("/vouchers/validate", {
        method: "POST",
        body: JSON.stringify({ code: validationCode }),
      });
      setValidationResult({ success: true, message: "Voucher is valid and ready for redemption." });
    } catch (error: any) {
      setValidationResult({ success: false, message: error.message || "Invalid voucher code." });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDownloadReports = async () => {
    try {
      const reportData = await apiClient("/merchants/reports");
      
      // Generate CSV content
      const csvContent = generateReportCSV(reportData);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `merchant-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to generate report. Please try again.");
    }
  };

  const handleMerchantDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDispute(true);
    try {
      // Re-using the same report endpoint but for merchant context
      await apiClient.post("/user/report", {
        merchant_id: merchant.id,
        reason: disputeForm.reason,
        description: `MERCHANT DISPUTE: ${disputeForm.description}`,
        priority: "High"
      });
      setIsDisputing(false);
      setDisputeForm({ reason: "", description: "" });
      alert("Report received. Our partner support team will contact you shortly.");
    } catch (error) {
      console.error("Dispute submission failed", error);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const generateReportCSV = (data: any) => {
    let csv = "Merchant Performance Report\n";
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Summary section
    csv += "SUMMARY\n";
    csv += `Business Name,${data.merchant.name}\n`;
    csv += `Total Revenue,₦${data.summary.totalRevenue.toLocaleString()}\n`;
    csv += `Total Redemptions,${data.summary.totalRedemptions}\n`;
    csv += `Active Deals,${data.summary.activeDeals}\n`;
    csv += `Total Deals,${data.summary.totalDeals}\n`;
    csv += `Average Rating,${data.summary.avgRating}/5\n`;
    csv += `Total Reviews,${data.summary.totalReviews}\n\n`;
    
    // Deals section
    csv += "DEALS\n";
    csv += "Title,Original Price,Discount Price,Total Quantity,Sold Quantity,Status,Created Date,Expiry Date\n";
    data.deals.forEach((deal: any) => {
      csv += `"${deal.title}",${deal.originalPrice},${deal.discountPrice},${deal.totalQuantity},${deal.soldQuantity},"${deal.status}","${new Date(deal.createdAt).toLocaleDateString()}","${new Date(deal.expiryDate).toLocaleDateString()}"\n`;
    });
    csv += "\n";
    
    // Redemptions section
    csv += "RECENT REDEMPTIONS\n";
    csv += "Voucher Code,Deal Title,Customer Name,Customer Email,Redeemed Date,Revenue\n";
    data.redemptions.slice(0, 50).forEach((redemption: any) => {
      csv += `"${redemption.voucherCode}","${redemption.dealTitle}","${redemption.customerName}","${redemption.customerEmail}","${new Date(redemption.redeemedAt).toLocaleString()}","₦${redemption.revenue}"\n`;
    });
    
    return csv;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Welcome back, {merchant?.business_name || "Merchant"}
            </h1>
            <p className="text-slate-500 font-medium">Your business performance is looking strong today.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setIsDisputing(true)}
               className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
             >
                <LifeBuoy size={14} /> Get Help
             </button>
             <button 
               onClick={handleDownloadReports}
               className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all"
             >
                Download Reports
             </button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-7 rounded-[2.5rem] border shadow-sm transition-all group relative overflow-hidden hover:-translate-y-1 duration-300 ${
                stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                stat.color === 'black' ? 'bg-[#000000] border-black text-white' :
                'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 backdrop-blur-sm shadow-sm ${
                  stat.color === 'emerald' ? 'bg-white/60 text-emerald-600' :
                  stat.color === 'black' ? 'bg-white/10 text-white' :
                  'bg-white/60 text-yellow-600'
              }`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                  stat.change.startsWith('+') ? 
                  (stat.color === 'emerald' ? 'text-emerald-700 bg-emerald-100/50' : 'text-emerald-600 bg-emerald-50') : 
                  'text-slate-500 bg-slate-50'
              }`}>
                {stat.change} <ArrowUpRight size={12} className="inline-block" />
              </span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                stat.color === 'emerald' ? 'text-emerald-500' :
                stat.color === 'black' ? 'text-slate-400' :
                'text-yellow-600'
            }`}>{stat.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${
                stat.color === 'emerald' ? 'text-emerald-700' :
                stat.color === 'black' ? 'text-white' :
                'text-yellow-700'
            }`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Customer Experience Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Link to="/merchant/reviews" className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group flex flex-col md:flex-row items-center gap-8 text-left">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-4xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <MessageCircle size={36} />
              </div>
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">New Feedback</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Customer Reviews</h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Build your brand trust by responding to customer experiences. Public replies show potential customers that you care about their satisfaction.
                  </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-all">
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-500" />
              </div>
          </Link>

          <div 
            onClick={() => setIsDisputing(true)}
            className="bg-[#000000] p-10 rounded-[3rem] border border-black shadow-xl cursor-pointer hover:scale-[0.98] transition-all group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
                      <LifeBuoy size={24} />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">Partner Support</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                      Need help with a transaction or have a technical issue? Open a dispute or contact support.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Get Help Now <ChevronRight size={12} />
                  </div>
              </div>
          </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none mb-1">Notifications</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Real-time alerts & updates</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm font-bold">All clear! No new notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.slice(0, 10).map((notification, i) => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-6 hover:bg-slate-50/30 transition-colors ${
                    notification.priority === 'high' ? 'border-l-4 border-red-400 bg-red-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notification.type === 'redemption' ? 'bg-emerald-100 text-emerald-600' :
                      notification.type === 'inventory' ? 'bg-red-100 text-red-600' :
                      notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'redemption' && <CheckCircle2 size={20} />}
                      {notification.type === 'inventory' && <TrendingUp size={20} />}
                      {notification.type === 'review' && <Users size={20} />}
                      {notification.type === 'expiry' && <Clock size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{notification.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Redemptions */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
               <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none mb-1">Clearance Log</h3>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Real-time liquidation ledger</p>
            </div>
            <button 
              onClick={() => navigate("/merchant/qr-scanner")}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 transition-all"
            >
              Terminal Console
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Voucher / Deal</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                   {redemptions.length === 0 ? (
                    <motion.tr 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Ticket size={40} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No redemptions logged yet</p>
                      </td>
                    </motion.tr>
                  ) : redemptions.map((r, i) => (
                    <motion.tr 
                      key={r.id + i} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5 font-mono text-[10px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">{r.id}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase">
                            {r.customer?.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{r.customer}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-none mb-1">{r.deal}</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{r.time || new Date().toLocaleDateString()}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">
                          <CheckCircle2 size={12} />
                          {r.status || "Redeemed"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Validation Tool */}
        <div className="space-y-6">
          <div className="bg-[#000000] rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black mb-3 tracking-tight leading-none">Instant Validation</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed opacity-70 italic">Input 12-digit protocol hash from customer wallet.</p>
              </div>
              
              <div className="space-y-6">
                <div className="relative group">
                   <div className={`absolute -inset-0.5 rounded-2xl opacity-20 blur transition-all duration-500 ${isValidating ? 'bg-emerald-500 opacity-60 animate-pulse' : 'bg-white opacity-10 group-focus-within:opacity-30'}`} />
                   <input 
                    type="text" 
                    value={validationCode}
                    onChange={handleInputChange}
                    placeholder="SLSH-XXXX-XXXX" 
                    className="relative w-full bg-slate-800/80 border border-white/10 rounded-2xl py-6 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:bg-slate-800 focus:border-emerald-500/50 transition-all text-center text-xl font-black tracking-widest uppercase"
                   />
                </div>

                <AnimatePresence>
                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border ${
                        validationResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {validationResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {validationResult.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleValidation}
                  disabled={isValidating || !validationCode.trim()}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    isValidating 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20'
                  }`}
                >
                  {isValidating ? (
                   <>
                     <Clock className="animate-spin" size={18} /> Validating...
                   </>
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Validate Voucher
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Users size={80} />
            </div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-8">Business Support</h3>
            <div className="space-y-4 relative z-10">
              <button 
                onClick={() => {
                    setSelectedSupport({
                        title: "Merchant Booking Policy",
                        content: (
                            <div className="space-y-4 text-sm font-medium text-slate-600 leading-relaxed">
                                <p>This policy outlines the standard operating procedures for redeeming Slasham vouchers at your business location.</p>
                                <ul className="space-y-3 list-disc pl-5">
                                    <li><strong className="text-slate-900">Verification:</strong> Merchants must verify the voucher code using the Slasham Terminal before providing service.</li>
                                    <li><strong className="text-slate-900">Validity:</strong> Vouchers are only valid for the specific deal and timeframe indicated on the digital coupon.</li>
                                    <li><strong className="text-slate-900">No Double Discounting:</strong> Slasham vouchers cannot be combined with other in-house promotions unless explicitly stated.</li>
                                    <li><strong className="text-slate-900">Refunds:</strong> Slasham handles all refund inquiries. If a customer requests a refund at your location, please direct them to Slasham Support.</li>
                                    <li><strong className="text-slate-900">Identification:</strong> You reserve the right to ask for a valid ID to match the customer name on the voucher.</li>
                                </ul>
                            </div>
                        )
                    });
                    setIsSupportModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-4xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">Booking Policy</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </button>

              <button 
                onClick={() => {
                    setSelectedSupport({
                        title: "Merchant System Guide",
                        content: (
                            <div className="space-y-6 text-sm font-medium text-slate-600 leading-relaxed">
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 text-left">Quick Start</p>
                                    <p className="text-slate-700">Follow these steps to successfully manage your presence on Slasham.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-left">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">1</div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Register Deals</p>
                                            <p>Use the 'Campaigns' tab to submit products. Admin approval usually takes 2-4 hours.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-left">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">2</div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Validate Codes</p>
                                            <p>When a customer arrives, use the 'Scanner' to input their 12-digit code. Always 'Redeem' to get paid.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-left">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">3</div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Monitor Payouts</p>
                                            <p>Track your earnings in 'Analytics'. Settlements are processed every Friday at 12:00 PM.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Technical Support</p>
                                    <p>Email: <span className="text-indigo-600">partners@slasham.com</span></p>
                                </div>
                            </div>
                        )
                    });
                    setIsSupportModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-4xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:text-emerald-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight">System Guide</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title={selectedSupport?.title || "Support"}
        description="Help and documentation for Slasham partners."
      >
        <div className="pt-4 pb-6">
            {selectedSupport?.content}
            <button 
                onClick={() => setIsSupportModalOpen(false)}
                className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
            >
                Got it, thanks
            </button>
        </div>
      </AdminModal>

      {/* Merchant Dispute Modal */}
      <AnimatePresence>
        {isDisputing && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-6 text-left">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onClick={() => setIsDisputing(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3 text-slate-900">
                            <LifeBuoy size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest">Partner Support</h3>
                        </div>
                        <button onClick={() => setIsDisputing(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                            <XCircle size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleMerchantDispute} className="p-8 lg:p-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Dispute Type</label>
                            <select 
                                required
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                                value={disputeForm.reason}
                                onChange={e => setDisputeForm({...disputeForm, reason: e.target.value})}
                            >
                                <option value="">Select issue type</option>
                                <option value="Payment Issue">Payment/Settlement Issue</option>
                                <option value="Customer Dispute">Customer Behavior/Dispute</option>
                                <option value="Technical Bug">Technical Platform Issue</option>
                                <option value="Account Settings">Account/Profile Verification</option>
                                <option value="Other">Other Operational Issue</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Description</label>
                            <textarea 
                                required
                                rows={4}
                                placeholder="Describe the issue in detail..."
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                                value={disputeForm.description}
                                onChange={e => setDisputeForm({...disputeForm, description: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmittingDispute}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmittingDispute ? "Sending Signal..." : "Submit Inquiry"}
                            <ArrowUpRight size={16} />
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
