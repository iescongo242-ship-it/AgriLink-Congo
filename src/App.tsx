import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PermanentDemoBanner } from './components/PermanentDemoBanner';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PresentationTourModal } from './components/PresentationTourModal';
import { LoginPage } from './components/LoginPage';

// Dedicated Role Spaces
import { FarmerSpace } from './components/spaces/FarmerSpace';
import { CoopSpace } from './components/spaces/CoopSpace';
import { TransporterSpace } from './components/spaces/TransporterSpace';
import { BuyerSpace } from './components/spaces/BuyerSpace';

// General Modules
import { DashboardView } from './components/DashboardView';
import { MarketView } from './components/MarketView';
import { ProducerView } from './components/ProducerView';
import { FreshGuardView } from './components/FreshGuardView';
import { TransportView } from './components/TransportView';
import { USSDSimulator } from './components/USSDSimulator';
import { TransactionsView } from './components/TransactionsView';
import { RevenuesView } from './components/RevenuesView';
import { NationalView } from './components/NationalView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not authenticated, show the intelligent login screen first!
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-950 text-[#172B24] dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Permanent Honesty & Demo Banner */}
      <PermanentDemoBanner />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar (Deep Green #064E3B) with RBAC filtering */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page View Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Dedicated Role Spaces */}
            {activeTab === 'farmer_space' && <FarmerSpace />}
            {activeTab === 'coop_space' && <CoopSpace />}
            {activeTab === 'transporter_space' && <TransporterSpace />}
            {activeTab === 'buyer_space' && <BuyerSpace />}

            {/* Standard Modules */}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'market' && <MarketView />}
            {activeTab === 'producer' && <ProducerView />}
            {activeTab === 'freshguard' && <FreshGuardView />}
            {activeTab === 'transport' && <TransportView />}
            {activeTab === 'ussd' && <USSDSimulator />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'revenues' && <RevenuesView />}
            {activeTab === 'national' && <NationalView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'help' && <HelpView />}
          </main>
        </div>
      </div>

      {/* Floating Presentation Assistant */}
      <PresentationTourModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
