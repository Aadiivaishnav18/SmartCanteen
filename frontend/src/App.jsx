import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { FoodDetailModal } from './components/common/FoodDetailModal';
import { EditProfileModal } from './components/common/EditProfileModal';

// Student Views
import { LandingPage } from './components/student/LandingPage';
import { StudentLogin } from './components/student/StudentLogin';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentMenu } from './components/student/StudentMenu';
import { StudentCart } from './components/student/StudentCart';
import { StudentCheckout } from './components/student/StudentCheckout';
import { OrderConfirmation } from './components/student/OrderConfirmation';
import { OrderTracking } from './components/student/OrderTracking';
import { OrderHistory } from './components/student/OrderHistory';

// Staff Views
import { StaffDashboard } from './components/staff/StaffDashboard';
import { StaffOrderDetails } from './components/staff/StaffOrderDetails';
import { StaffInventory } from './components/staff/StaffInventory';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MenuManagement } from './components/admin/MenuManagement';
import { PickupSlotManagement } from './components/admin/PickupSlotManagement';
import { AdminOrders } from './components/admin/AdminOrders';

import { Footer } from './components/common/Footer';

const MainApp = () => {
  const { 
    currentUser, 
    studentTab, 
    staffTab, 
    adminTab, 
    selectedFoodModal, 
    setSelectedFoodModal,
    isEditProfileOpen,
    setIsEditProfileOpen
  } = useApp();

  const renderContent = () => {
    if (!currentUser) {
      if (studentTab === 'login') return <StudentLogin />;
      return <LandingPage />;
    }

    if (currentUser.role === 'student') {
      switch (studentTab) {
        case 'landing':
          return <LandingPage />;
        case 'login':
          return <StudentDashboard />;
        case 'dashboard':
          return <StudentDashboard />;
        case 'menu':
          return <StudentMenu />;
        case 'cart':
          return <StudentCart />;
        case 'checkout':
          return <StudentCheckout />;
        case 'order-confirmation':
          return <OrderConfirmation />;
        case 'tracking':
          return <OrderTracking />;
        case 'history':
          return <OrderHistory />;
        default:
          return <StudentDashboard />;
      }
    }

    if (currentUser.role === 'staff') {
      switch (staffTab) {
        case 'dashboard':
        case 'orders':
          return <StaffDashboard />;
        case 'details':
          return <StaffOrderDetails />;
        case 'inventory':
          return <StaffInventory />;
        default:
          return <StaffDashboard />;
      }
    }

    if (currentUser.role === 'admin') {
      switch (adminTab) {
        case 'dashboard':
        case 'analytics':
          return <AdminDashboard />;
        case 'menu-mgmt':
          return <MenuManagement />;
        case 'pickup-slots':
          return <PickupSlotManagement />;
        case 'orders':
          return <AdminOrders />;
        default:
          return <AdminDashboard />;
      }
    }

    return <LandingPage />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172018] flex flex-col font-sans selection:bg-[#16A34A] selection:text-white">
      <Header />
      <Toast />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

      {/* Global Food Detail Modal */}
      {selectedFoodModal && (
        <FoodDetailModal 
          food={selectedFoodModal} 
          onClose={() => setSelectedFoodModal(null)} 
        />
      )}

      {/* Global Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal 
          onClose={() => setIsEditProfileOpen(false)} 
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
