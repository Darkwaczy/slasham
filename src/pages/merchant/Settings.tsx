import { Save, Store, Clock, Shield, Bell, MapPin, Globe, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

type NotificationSettings = {
  emailAlerts: boolean;
  smsGateway: boolean;
  pushNotifications: boolean;
};

type OperatingHour = {
  day: string;
  start: string;
  end: string;
};

export default function MerchantSettings() {
  const [form, setForm] = useState({
    businessName: "",
    websiteUrl: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([
    { day: "Monday - Friday", start: "09:00 AM", end: "10:00 PM" },
    { day: "Saturday", start: "09:00 AM", end: "10:00 PM" },
    { day: "Sunday", start: "09:00 AM", end: "10:00 PM" },
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    smsGateway: true,
    pushNotifications: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await apiClient("/merchants/my-profile");
        setForm({
          businessName: profile.business_name || "",
          websiteUrl: profile.website_url || "",
          description: profile.description || "",
          address: profile.address || "",
          city: profile.city || "",
          phone: profile.phone || "",
          logoUrl: profile.logo_url || "",
          bannerUrl: profile.banner_url || "",
        });
      } catch (error) {
        console.error("Failed to load merchant profile", error);
      }
    };

    const persistedHours = window.localStorage.getItem("merchantSettingsOperatingHours");
    const persistedNotifications = window.localStorage.getItem("merchantSettingsNotificationSettings");

    if (persistedHours) {
      try {
        setOperatingHours(JSON.parse(persistedHours));
      } catch {
        // ignore invalid local storage data
      }
    }

    if (persistedNotifications) {
      try {
        setNotificationSettings(JSON.parse(persistedNotifications));
      } catch {
        // ignore invalid local storage data
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("merchantSettingsOperatingHours", JSON.stringify(operatingHours));
  }, [operatingHours]);

  useEffect(() => {
    window.localStorage.setItem("merchantSettingsNotificationSettings", JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHour = (index: number, field: keyof OperatingHour, value: string) => {
    setOperatingHours((prev) => prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour)));
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      await apiClient("/merchants/profile", {
        method: "POST",
        body: JSON.stringify({
          business_name: form.businessName,
          description: form.description,
          address: form.address,
          city: form.city,
          phone: form.phone,
          website_url: form.websiteUrl,
          logo_url: form.logoUrl,
          banner_url: form.bannerUrl,
        }),
      });

      setStatusType("success");
      setStatusMessage("Business settings saved successfully.");
    } catch (error: any) {
      setStatusType("error");
      setStatusMessage(error.message || "Unable to save settings. Please try again.");
      console.error("Failed to save merchant settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Business Profile</h1>
          <p className="text-slate-500 font-medium">Configure how users see your brand</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} /> {isSaving ? "Saving..." : "Update Business"}
        </button>
      </div>

      {statusMessage && (
        <div className={`rounded-2xl p-4 text-sm font-bold ${statusType === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {statusMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Store size={24} />
              </div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Public Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Identity</label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                    placeholder="Enter business name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Website</label>
                <div className="relative group/input">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={form.websiteUrl}
                    onChange={(event) => updateField("websiteUrl", event.target.value)}
                    placeholder="https://yourbusiness.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Lagos"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe your business for customers"
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="Enter your business address"
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Operating Hours</h3>
            </div>

            <div className="space-y-4">
              {operatingHours.map((hour, i) => (
                <div key={hour.day} className="grid gap-4 md:grid-cols-[1fr_120px_20px_120px] items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <span className="text-sm font-bold text-slate-600 tracking-tight">{hour.day}</span>
                  <input
                    type="text"
                    value={hour.start}
                    onChange={(event) => updateHour(i, "start", event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 text-center"
                  />
                  <span className="text-slate-300 font-black text-center">TO</span>
                  <input
                    type="text"
                    value={hour.end}
                    onChange={(event) => updateHour(i, "end", event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all" />
            <Shield className="text-yellow-400 mb-6 relative z-10" size={32} />
            <h3 className="text-xl font-black mb-4 tracking-tight relative z-10">Security Center</h3>

            <div className="space-y-6 relative z-10">
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                Enable 2FA
              </button>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                Rotate API Key
              </button>
              <button className="w-full py-4 bg-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/30 transition-all">
                Deactivate Account
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <Bell className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black mb-4 tracking-tight leading-none">Notifications</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">Manage how you receive alerts about new redemptions and reviews.</p>

            <div className="space-y-4">
              {(
                [
                  { label: "Email Alerts", key: "emailAlerts" as const },
                  { label: "SMS Gateway", key: "smsGateway" as const },
                  { label: "Push Notifications", key: "pushNotifications" as const },
                ] as const
              ).map((item) => (
                <div key={item.key} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="text-sm font-bold text-slate-500 tracking-tight">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleNotification(item.key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings[item.key] ? "bg-emerald-600" : "bg-slate-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationSettings[item.key] ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
