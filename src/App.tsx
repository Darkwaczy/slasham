/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import HotDeals from "./pages/HotDeals";
import Business from "./pages/Business";
import MyBusinessBenefits from "./pages/business/MyBusinessBenefits";
import RunCampaign from "./pages/business/RunCampaign";
import ListBusiness from "./pages/business/ListBusiness";
import RegistrationFlow from "./pages/business/RegistrationFlow";
import BusinessDetail from "./pages/BusinessDetail";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import AboutUs from "./pages/company/AboutUs";
import Careers from "./pages/company/Careers";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminBusinesses from "./pages/admin/Businesses";
import AdminDeals from "./pages/admin/Deals";
import AdminCoupons from "./pages/admin/Coupons";
import AdminRedemptions from "./pages/admin/Redemptions";
import AdminReviews from "./pages/admin/Reviews";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";
import MerchantLayout from "./components/MerchantLayout";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantCampaigns from "./pages/merchant/Campaigns";
import MerchantCustomers from "./pages/merchant/Customers";
import MerchantReviews from "./pages/merchant/Reviews";
import MerchantAnalytics from "./pages/merchant/Analytics";
import MerchantSettings from "./pages/merchant/Settings";
import UserDashboardOverview from "./pages/user/UserDashboardOverview";
import MyCoupons from "./pages/user/MyCoupons";
import SavedDeals from "./pages/user/SavedDeals";
import OrdersPayments from "./pages/user/OrdersPayments";
import Reviews from "./pages/user/Reviews";
import Rewards from "./pages/user/RewardsReferrals";
import Settings from "./pages/user/Settings";
import Press from "./pages/company/Press";
import Contact from "./pages/company/Contact";
import MerchantScanner from "./pages/merchant/Scanner";

// Category Pages
import FoodDeals from "./pages/categories/FoodDeals";
import ExperienceDeals from "./pages/categories/ExperienceDeals";
import BeautyDeals from "./pages/categories/BeautyDeals";
import ProductDeals from "./pages/categories/ProductDeals";
import ServiceDeals from "./pages/categories/ServiceDeals";

// How It Works Sub-Pages
import BuyCoupon from "./pages/how-it-works/BuyCoupon";
import VisitBusiness from "./pages/how-it-works/VisitBusiness";
import UnlockMore from "./pages/how-it-works/UnlockMore";

// City Pages
import Abuja from "./pages/cities/Abuja";
import Lagos from "./pages/cities/Lagos";
import PortHarcourt from "./pages/cities/PortHarcourt";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Analytics />
      <SpeedInsights />
      <Routes>
        <Route path="login" element={<Auth />} />
        <Route path="signup" element={<Auth />} />
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
          <Route path="business/:id" element={<BusinessDetail />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="careers" element={<Careers />} />
          <Route path="press" element={<Press />} />
          <Route path="contact" element={<Contact />} />
          
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

          <Route path="*" element={<div className="p-20 text-center text-2xl">Coming Soon</div>} />
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
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="businesses" element={<AdminBusinesses />} />
          <Route path="deals" element={<AdminDeals />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="redemptions" element={<AdminRedemptions />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<AdminReports />} />
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
    </HashRouter>
  );
}
