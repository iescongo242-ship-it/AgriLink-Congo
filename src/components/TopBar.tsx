import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DEMO_PROFILES } from '../data/initialData';
import {
  Bell,
  Moon,
  Sun,
  Menu,
  Download,
  ChevronDown,
  Check,
  UserCheck,
  Globe,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentProfile,
    setCurrentProfile,
    language,
    setLanguage,
    t,
    isDarkMode,
    setIsDarkMode,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setActiveTab,
    logout,
  } = useApp();

  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-7 z-30 transition-colors">
      <div className="px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Congo flag */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Republic of Congo Flag and country text */}
          <div className="flex items-center gap-2">
            <svg
              className="w-7 h-5 rounded-xs shadow-xs border border-slate-300 dark:border-slate-700 shrink-0"
              viewBox="0 0 30 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Drapeau de la République du Congo"
            >
              {/* Congo flag: green top-left, yellow diagonal, red bottom-right */}
              <rect width="30" height="20" fill="#009543" />
              <polygon points="0,20 10,20 30,0 20,0" fill="#FBDE4A" />
              <polygon points="10,20 30,20 30,0" fill="#DC241F" />
            </svg>
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight hidden sm:inline">
              {t.countryTitle}
            </span>
          </div>
        </div>

        {/* Right: Actions, Language, Notifications, Dark mode, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Changer de langue (Français, Lingala, Kituba)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="uppercase font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 mb-1">
                  {t.provisionalNotice}
                </div>
                {[
                  { code: 'fr' as const, label: 'Français (Congo)' },
                  { code: 'ln' as const, label: 'Lingala (Brazzaville / Kin)' },
                  { code: 'kt' as const, label: 'Kituba / Munukutuba (Sud)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                      language === item.code
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {language === item.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition"
              title="Installer AgriLink Congo sur votre appareil"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer PWA</span>
            </button>
          )}

          {isIOS && !isInstallable && (
            <button
              onClick={() => setShowIOSInstallGuide(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer iOS</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Basculer le mode sombre"
            title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {notifications.length}
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Tout effacer</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-left transition cursor-pointer ${
                          !n.isRead
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Selector & Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Changer de profil utilisateur (Agriculteur, Coopérative, Transporteur, Acheteur)"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-emerald-500">
                {currentProfile.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                  {currentProfile.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                  {currentProfile.role === 'farmer'
                    ? 'Agriculteur'
                    : currentProfile.role === 'cooperative'
                    ? 'Coopérative'
                    : currentProfile.role === 'transporter'
                    ? 'Transporteur'
                    : 'Acheteur'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Changer de rôle actif
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Basculez d'utilisateur pour tester les parcours :
                  </p>
                </div>

                <div className="py-1">
                  {DEMO_PROFILES.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => {
                        setCurrentProfile(prof);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                        currentProfile.id === prof.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {prof.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{prof.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {prof.title} · {prof.location}
                        </p>
                      </div>
                      {currentProfile.id === prof.id && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Paramètres du profil</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Se déconnecter (Changer d'acteur)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iOS Install modal guide if requested */}
      {showIOSInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Installer sur iPhone / iPad
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              1. Appuyez sur le bouton <strong>Partager</strong> dans Safari (en bas au centre).<br />
              2. Faites défiler et appuyez sur <strong>Sur l'écran d'accueil</strong>.<br />
              3. Validez : l'application AgriLink Congo fonctionnera même hors connexion !
            </p>
            <button
              onClick={() => setShowIOSInstallGuide(false)}
              className="mt-4 w-full rounded-lg bg-emerald-600 text-white py-2 text-xs font-medium hover:bg-emerald-700 transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
