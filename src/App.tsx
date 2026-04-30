/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminProvider } from "./context/AdminContext";

import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, lazy, Suspense } from "react";
import Layout from "./components/Layout";
import Home from "./components/Home";

// Lazy Load Pages
const Deals = lazy(() => import("./pages/Deals"));
const DealDetail = lazy(() => import("./pages/DealDetail"));
const HotDeals = lazy(() => import("./pages/HotDeals"));
const Business = lazy(() => import("./pages/Business"));
const MyBusinessBenefits = lazy(() => import("./pages/business/MyBusinessBenefits"));
const RunCampaign = lazy(() => import("./pages/business/RunCampaign"));
const ListBusiness = lazy(() => import("./pages/business/ListBusiness"));
const RegistrationFlow = lazy(() => import("./pages/business/RegistrationFlow"));
const BusinessDetail = lazy(() => import("./pages/BusinessDetail"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AboutUs = lazy(() => import("./pages/company/AboutUs"));
const Careers = lazy(() => import("./pages/company/Careers"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminBusinesses = lazy(() => import("./pages/admin/Businesses"));
const AdminDeals = lazy(() => import("./pages/admin/Deals"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminRedemptions = lazy(() => import("./pages/admin/Redemptions"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminApplications = lazy(() => import("./pages/admin/Applications"));
const AdminEmail = lazy(() => import("./pages/admin/Email"));
const UserLayout = lazy(() => import("./components/UserLayout"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const MerchantLayout = lazy(() => import("./components/MerchantLayout"));
const MerchantDashboard = lazy(() => import("./pages/MerchantDashboard"));
const MerchantCampaigns = lazy(() => import("./pages/merchant/Campaigns"));
const MerchantCustomers = lazy(() => import("./pages/merchant/Customers"));
const MerchantReviews = lazy(() => import("./pages/merchant/Reviews"));
const MerchantAnalytics = lazy(() => import("./pages/merchant/Analytics"));
const MerchantSettings = lazy(() => import("./pages/merchant/Settings"));
const UserDashboardOverview = lazy(() => import("./pages/user/UserDashboardOverview"));
const MyCoupons = lazy(() => import("./pages/user/MyCoupons"));
const SavedDeals = lazy(() => import("./pages/user/SavedDeals"));
const OrdersPayments = lazy(() => import("./pages/user/OrdersPayments"));
const Reviews = lazy(() => import("./pages/user/Reviews"));
const Rewards = lazy(() => import("./pages/user/RewardsReferrals"));
const Settings = lazy(() => import("./pages/user/Settings"));
const Press = lazy(() => import("./pages/company/Press"));
const Contact = lazy(() => import("./pages/company/Contact"));
const MerchantScanner = lazy(() => import("./pages/merchant/Scanner"));
const MerchantApply = lazy(() => import("./pages/merchant/Apply"));
const MerchantLogin = lazy(() => import("./pages/merchant/Login"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Category Pages
const FoodDeals = lazy(() => import("./pages/categories/FoodDeals"));
const ExperienceDeals = lazy(() => import("./pages/categories/ExperienceDeals"));
const BeautyDeals = lazy(() => import("./pages/categories/BeautyDeals"));
const ProductDeals = lazy(() => import("./pages/categories/ProductDeals"));
const ServiceDeals = lazy(() => import("./pages/categories/ServiceDeals"));

// How It Works Sub-Pages
const BuyCoupon = lazy(() => import("./pages/how-it-works/BuyCoupon"));
const VisitBusiness = lazy(() => import("./pages/how-it-works/VisitBusiness"));
const UnlockMore = lazy(() => import("./pages/how-it-works/UnlockMore"));

// City Pages
const Abuja = lazy(() => import("./pages/cities/Abuja"));
const Lagos = lazy(() => import("./pages/cities/Lagos"));
const PortHarcourt = lazy(() => import("./pages/cities/PortHarcourt"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
);

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-4xl flex items-center justify-center mb-8 animate-bounce">
        <span className="text-4xl font-black">404</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Lost in the sauce?</h1>
      <p className="text-slate-500 max-w-md font-medium leading-relaxed mb-10">
        We couldn't find the page you're looking for. It might have moved, or the link is just broken.
      </p>
      <Link to="/" className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
        Back to Safety
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="login" element={<Auth />} />
          <Route path="signup" element={<Auth />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="merchant/login" element={<MerchantLogin />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/hot" element={<HotDeals />} />
            <Route path="deal/:id" element={<DealDetail />} />
            <Route path="business" element={<Business />} />
            <Route path="business/benefits" element={<MyBusinessBenefits />} />
            <Route path="business/campaign" element={<RunCampaign />} />
            <Route path="business/list" element={<ListBusiness />} />
            <Route path="business/register" element={<RegistrationFlow />} />
            <Route path="business/apply" element={<MerchantApply />} />
            <Route path="business/:id" element={<BusinessDetail />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="careers" element={<Careers />} />
            <Route path="press" element={<Press />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            
            {/* Category Routes */}
            <Route path="deals/food" element={<FoodDeals />} />
            <Route path="deals/experiences" element={<ExperienceDeals />} />
            <Route path="deals/beauty" element={<BeautyDeals />} />
            <Route path="deals/products" element={<ProductDeals />} />
            <Route path="deals/services" element={<ServiceDeals />} />

            {/* How It Works Sub-Routes */}
            <Route path="how-it-works/buy" element={<BuyCoupon />} />
            <Route path="how-it-works/visit" element={<VisitBusiness />} />
            <Route path="how-it-works/unlock" element={<UnlockMore />} />

            {/* City Routes */}
            <Route path="cities/abuja" element={<Abuja />} />
            <Route path="cities/lagos" element={<Lagos />} />
            <Route path="cities/port-harcourt" element={<PortHarcourt />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* User Dashboard Routes (No Global Header/Footer) */}
          <Route path="user-dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboardOverview />} />
          </Route>
          
          <Route path="user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboardOverview />} />
            <Route path="coupons" element={<MyCoupons />} />
            <Route path="saved" element={<SavedDeals />} />
            <Route path="orders" element={<OrdersPayments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="admin-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          
          {/* Admin Dashboard Routes (No Global Header/Footer) */}
          <Route path="admin" element={<Suspense fallback={<LoadingFallback />}><AdminProvider><AdminLayout /></AdminProvider></Suspense>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="deals" element={<AdminDeals />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="redemptions" element={<AdminRedemptions />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="email" element={<AdminEmail />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="MerchantDashboard" element={<Navigate to="/merchant/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          {/* Merchant Dashboard Routes (No Global Header/Footer) */}
          <Route path="merchant-dashboard" element={<MerchantLayout />}>
            <Route index element={<MerchantDashboard />} />
          </Route>

          <Route path="merchant" element={<MerchantLayout />}>
            <Route path="dashboard" element={<MerchantDashboard />} />
            <Route path="campaigns" element={<MerchantCampaigns />} />
            <Route path="customers" element={<MerchantCustomers />} />
            <Route path="reviews" element={<MerchantReviews />} />
            <Route path="analytics" element={<MerchantAnalytics />} />
            <Route path="settings" element={<MerchantSettings />} />
            <Route path="scanner" element={<MerchantScanner />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
