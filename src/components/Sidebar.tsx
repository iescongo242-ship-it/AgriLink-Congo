import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Sprout,
  Activity,
  Truck,
  PhoneCall,
  CreditCard,
  Coins,
  Landmark,
  Settings,
  HelpCircle,
  X,
  LogOut,
  Sparkles,
  Users,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentProfile, logout, t } = useApp();

  // Role dedicated main space
  const dedicatedSpaceItem =
    currentProfile.role === 'farmer'
      ? { id: 'farmer_space', label: 'Mon Espace Producteur', icon: Sprout, badge: 'Dédié' }
      : currentProfile.role === 'cooperative'
      ? { id: 'coop_space', label: 'Mon Espace Coopérative', icon: Users, badge: 'Dédié' }
      : currentProfile.role === 'transporter'
      ? { id: 'transporter_space', label: 'Mon Espace Transporteur', icon: Truck, badge: 'Dédié' }
      : currentProfile.role === 'buyer'
      ? { id: 'buyer_space', label: 'Mon Espace Grossiste', icon: ShoppingBag, badge: 'Dédié' }
      : { id: 'dashboard', label: 'Observatoire National', icon: LayoutDashboard, badge: 'Supervision' };

  // All available system modules
  const allNavItems: NavItem[] = [
    dedicatedSpaceItem,
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'market', label: t.navMarket, icon: ShoppingBag },
    { id: 'producer', label: t.navProducer, icon: Sprout },
    { id: 'freshguard', label: t.navFreshGuard, icon: Activity, badge: 'IoT' },
    { id: 'transport', label: t.navTransport, icon: Truck },
    { id: 'ussd', label: t.navUSSD, icon: PhoneCall, badge: '*140#' },
    { id: 'transactions', label: t.navTransactions, icon: CreditCard },
    { id: 'revenues', label: t.navRevenues, icon: Coins },
    { id: 'national', label: t.navNational, icon: Landmark },
    { id: 'settings', label: t.navSettings, icon: Settings },
    { id: 'help', label: t.navHelp, icon: HelpCircle },
  ];

  // Filter based on the actor's authorized tabs
  const allowedSet = new Set(currentProfile.allowedTabs || []);
  const authorizedNavItems = allNavItems.filter((item, index) => {
    // Dedication item is always shown first
    if (index === 0) return true;
    return allowedSet.has(item.id) && item.id !== dedicatedSpaceItem.id;
  });

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#064E3B] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'
        } border-r border-emerald-900 shadow-xl lg:shadow-none`}
      >
        {/* Top: Logo & Brand */}
        <div className="p-5 border-b border-emerald-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Logo_feuille_verte__co-technologique_connect_e_0933bc6b.png"
                  alt="AgriLink Congo Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
                  AGRILINK CONGO
                </h1>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {t.slogan}
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active user badge */}
          <div className="mt-3.5 pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentProfile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate text-white">{currentProfile.name}</p>
                <p className="text-[10px] text-emerald-300 truncate capitalize">
                  {currentProfile.role === 'farmer'
                    ? 'Producteur'
                    : currentProfile.role === 'cooperative'
                    ? 'Coopérative'
                    : currentProfile.role === 'transporter'
                    ? 'Transporteur'
                    : currentProfile.role === 'buyer'
                    ? 'Grossiste'
                    : 'Observateur Jury'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 text-emerald-200">
              Acteur
            </span>
          </div>
        </div>

        {/* Center: Navigation Links (Restricted to Authorized Role Modules) */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {authorizedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-[#159447] text-white shadow-md shadow-emerald-950/40 font-semibold'
                    : 'text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isActive ? 'text-white' : 'text-emerald-300 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-900/60 text-emerald-100'
                        : 'bg-emerald-800 text-emerald-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Logout & Agriculture graphic */}
        <div className="p-4 border-t border-emerald-800/60 bg-emerald-950/40 space-y-3">
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-red-900/40 hover:text-red-200 border border-emerald-700/60 text-emerald-200 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Changer d'acteur / Déconnexion</span>
          </button>

          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 border border-emerald-800/70 text-emerald-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-xs font-semibold text-white">
                {t.footerSlogan}
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/80 leading-relaxed">
              Portail Vivrier Connecté · République du Congo
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
