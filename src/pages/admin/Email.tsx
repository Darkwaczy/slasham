import React, { useState, useEffect } from "react";
import { Mail, Send, Edit, RefreshCw, CheckCircle, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "../../api/client";

export default function AdminEmail() {
  const [activeTab, setActiveTab] = useState<'templates' | 'broadcasts'>('templates');
  const [templates, setTemplates] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Template Edit State
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Broadcast Compose State
  const [isComposing, setIsComposing] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastAudience, setBroadcastAudience] = useState("ALL_USERS");
  const [isSending, setIsSending] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tplRes, brdRes] = await Promise.all([
        apiClient("/admin/emails/templates"),
        apiClient("/admin/emails/broadcasts")
      ]);
      setTemplates(tplRes);
      setBroadcasts(brdRes);
    } catch (e) {
      console.error("Failed to fetch email data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    setIsSaving(true);
    try {
      await apiClient(`/admin/emails/templates/${editingTemplate.id}`, {
        method: "PUT",
        body: JSON.stringify({
          subject: editingTemplate.subject,
          html_body: editingTemplate.html_body
        })
      });
      await fetchData();
      setEditingTemplate(null);
    } catch (e) {
      console.error(e);
      alert("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await apiClient("/admin/emails/broadcast", {
        method: "POST",
        body: JSON.stringify({
          subject: broadcastSubject,
          html_body: broadcastBody,
          target_audience: broadcastAudience
        })
      });
      await fetchData();
      setIsComposing(false);
      setBroadcastSubject("");
      setBroadcastBody("");
      setActiveTab('broadcasts');
    } catch (e) {
      console.error(e);
      alert("Failed to send broadcast");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="text-indigo-600" size={32} /> Email Engine
          </h1>
          <p className="text-slate-500 font-medium">Manage system templates and trigger marketing broadcasts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsComposing(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Megaphone size={18} /> New Broadcast
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('templates')}
          className={`pb-4 px-2 font-bold text-sm tracking-wide transition-colors border-b-2 ${activeTab === 'templates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          System Templates
        </button>
        <button 
          onClick={() => setActiveTab('broadcasts')}
          className={`pb-4 px-2 font-bold text-sm tracking-wide transition-colors border-b-2 ${activeTab === 'broadcasts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Broadcast History
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          {activeTab === 'templates' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-100/50 border border-slate-100 p-6 rounded-3xl h-64 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-200/50 rounded-2xl mb-4"></div>
                  <div className="h-12 bg-slate-200 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-100/50 border border-slate-100 rounded-3xl h-96"></div>
          )}
        </div>
      ) : (
        <>
          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <>
              {templates.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-100 p-20 rounded-[3rem] text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Mail size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Templates Found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8">You haven't created any system templates yet. Run the SQL script to initialize default templates.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(tpl => (
                    <div key={tpl.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Edit size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 tracking-tight truncate">{tpl.name}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{tpl.subject}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-xs text-slate-600 font-mono bg-slate-50 p-4 rounded-2xl mb-4 overflow-hidden relative">
                         <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-50 pointer-events-none"></div>
                         {tpl.html_body.substring(0, 150)}...
                      </div>

                      <button 
                        onClick={() => setEditingTemplate(tpl)}
                        className="w-full py-3 bg-white border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 text-slate-900 font-bold rounded-2xl transition-colors text-sm uppercase tracking-widest flex justify-center items-center gap-2"
                      >
                        Edit Template
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* BROADCASTS TAB */}
          {activeTab === 'broadcasts' && (
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                    <th className="p-6">Date</th>
                    <th className="p-6">Subject</th>
                    <th className="p-6">Audience</th>
                    <th className="p-6">Sent Count</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                  {broadcasts.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold">No broadcasts sent yet.</td></tr>
                  )}
                  {broadcasts.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6">{new Date(b.created_at).toLocaleDateString()}</td>
                      <td className="p-6 font-bold text-slate-900">{b.subject}</td>
                      <td className="p-6">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{b.target_audience}</span>
                      </td>
                      <td className="p-6">{b.sent_count.toLocaleString()}</td>
                      <td className="p-6">
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle size={14} /> {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* EDIT TEMPLATE MODAL */}
      <AnimatePresence>
        {editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Edit: {editingTemplate.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Dynamic Variables available: {editingTemplate.variables?.join(', ')}</p>
                </div>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Subject Line</label>
                  <input 
                    type="text" 
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">HTML Body</label>
                  <textarea 
                    rows={12}
                    value={editingTemplate.html_body}
                    onChange={(e) => setEditingTemplate({...editingTemplate, html_body: e.target.value})}
                    className="w-full bg-slate-900 text-emerald-400 font-mono text-sm rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-slate-900/20 leading-relaxed"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 mt-auto">
                <button 
                  onClick={() => setEditingTemplate(null)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />} Save Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPOSE BROADCAST MODAL */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <form onSubmit={handleSendBroadcast} className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-2"><Megaphone className="text-indigo-600" /> New Broadcast</h3>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Target Audience</label>
                    <select 
                      value={broadcastAudience}
                      onChange={(e) => setBroadcastAudience(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all appearance-none"
                    >
                      <option value="ALL_USERS">All Users (Registered Users)</option>
                      <option value="MERCHANTS">All Businesses & Partners</option>
                      <option value="SUBSCRIBERS">Newsletter Subscribers Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Subject Line</label>
                    <input 
                      type="text" 
                      required
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all"
                      placeholder="e.g., Flash Sale: 50% Off Top Restaurants!"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Content (HTML)</label>
                    <textarea 
                      required
                      rows={10}
                      value={broadcastBody}
                      onChange={(e) => setBroadcastBody(e.target.value)}
                      placeholder="<h1>Hello!</h1><p>Write your marketing email here...</p>"
                      className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-mono text-sm rounded-2xl px-4 py-4 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 leading-relaxed"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 mt-auto">
                  <button 
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSending || !broadcastSubject || !broadcastBody}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />} Blast Email
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
