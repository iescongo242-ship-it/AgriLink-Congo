import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PROFILES } from '../data/initialData';
import { UserProfile, UserRole } from '../types';
import {
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Truck,
  ShoppingBag,
  Landmark,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  KeyRound,
  User,
  Sparkles,
  X,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerUser, registeredUsers, language, setLanguage, t } = useApp();

  // Mode: 'login' | 'register'
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [identifier, setIdentifier] = useState('06 612 34 56');
  const [password, setPassword] = useState('agri2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('farmer');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('Pool (Kinkala)');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Auto-fill animation effect
  const [highlightField, setHighlightField] = useState(false);

  // Role metadata
  const roleConfigs: Record<
    UserRole,
    {
      label: string;
      shortLabel: string;
      desc: string;
      icon: typeof UserCheck;
      badgeBg: string;
      badgeText: string;
      border: string;
    }
  > = {
    farmer: {
      label: 'Agriculteur / Producteur Vivrier',
      shortLabel: 'Producteur',
      desc: 'Gestion des récoltes, suivi des stocks de manioc/maïs et capteurs FreshGuard',
      icon: UserCheck,
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500',
    },
    cooperative: {
      label: 'Coopérative Agricole',
      shortLabel: 'Coopérative',
      desc: 'Mutualisation des récoltes, groupage logistique et expéditions collectives',
      icon: Building2,
      badgeBg: 'bg-teal-50 dark:bg-teal-950/80',
      badgeText: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-500',
    },
    transporter: {
      label: 'Transporteur Frigorifique',
      shortLabel: 'Transporteur',
      desc: 'Camions isothermes réfrigérés, suivi de la chaîne du froid sur la RN1',
      icon: Truck,
      badgeBg: 'bg-orange-50 dark:bg-orange-950/80',
      badgeText: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-500',
    },
    buyer: {
      label: 'Grossiste en Vivres Frais',
      shortLabel: 'Grossiste',
      desc: 'Approvisionnement des marchés urbains de Brazzaville & Pointe-Noire',
      icon: ShoppingBag,
      badgeBg: 'bg-blue-50 dark:bg-blue-950/80',
      badgeText: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500',
    },
    jury: {
      label: 'Direction Nationale & Supervision',
      shortLabel: 'Superviseur',
      desc: 'Observatoire vivrier, audit macroéconomique et régulation des prix',
      icon: Landmark,
      badgeBg: 'bg-purple-50 dark:bg-purple-950/80',
      badgeText: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500',
    },
  };

  // Helper to normalize phone numbers for matching
  const cleanPhone = (str: string) => str.replace(/[\s\-\.\(\)\+]/g, '').replace(/^242/, '');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const enteredClean = cleanPhone(identifier);
    const trimmedId = identifier.trim().toLowerCase();

    // Search in registeredUsers (which contains DEMO_PROFILES + dynamically created accounts)
    const matchedUser = registeredUsers.find((u) => {
      const uPhoneClean = cleanPhone(u.phone);
      const uEmail = u.email?.toLowerCase();
      const phoneOrEmailMatches =
        uPhoneClean === enteredClean ||
        (enteredClean.length >= 6 && uPhoneClean.includes(enteredClean)) ||
        uEmail === trimmedId;

      return phoneOrEmailMatches;
    });

    if (matchedUser) {
      // Validate password
      if (matchedUser.password && matchedUser.password !== password) {
        setIsSubmitting(false);
        setErrorMessage(
          'Mot de passe incorrect pour ce numéro. Vérifiez votre saisie ou utilisez les identifiants de démonstration.'
        );
        return;
      }

      setSuccessMessage(`Connexion réussie : bienvenue ${matchedUser.name} !`);
      setTimeout(() => {
        login(matchedUser);
      }, 500);
      return;
    }

    // Fallback: If identifier matches a demo role default or role selection
    const roleDefaultUser = registeredUsers.find((u) => u.role === selectedRole);
    if (roleDefaultUser && (password === roleDefaultUser.password || password.length >= 4)) {
      setSuccessMessage(`Connexion accordée pour l'espace ${roleConfigs[selectedRole].label}`);
      setTimeout(() => {
        login(roleDefaultUser);
      }, 500);
      return;
    }

    setIsSubmitting(false);
    setErrorMessage(
      'Identifiants non reconnus. Veuillez vérifier votre numéro (+242) et votre mot de passe, ou créer un compte.'
    );
  };

  // Handle Account Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const defaultTabs: Record<UserRole, string[]> = {
      farmer: ['farmer_space', 'producer', 'freshguard', 'transactions', 'ussd', 'settings', 'help'],
      cooperative: ['coop_space', 'producer', 'market', 'freshguard', 'transport', 'revenues', 'settings', 'help'],
      transporter: ['transporter_space', 'transport', 'transactions', 'settings', 'help'],
      buyer: ['buyer_space', 'market', 'transport', 'transactions', 'settings', 'help'],
      jury: ['dashboard', 'national', 'revenues', 'market', 'producer', 'freshguard', 'transport', 'ussd', 'transactions', 'settings', 'help'],
    };

    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: regName.trim(),
      role: regRole,
      title: `${roleConfigs[regRole].label} · Nvel inscrit`,
      location: regLocation,
      phone: regPhone.trim(),
      email: `${regName.toLowerCase().replace(/\s+/g, '.')}@agrilink.cg`,
      password: regPassword.trim(),
      avatar:
        regRole === 'farmer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : regRole === 'cooperative'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : regRole === 'transporter'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      description: `Acteur enregistré sur la plateforme AgriLink Congo dans la zone ${regLocation}.`,
      allowedTabs: defaultTabs[regRole],
    };

    setSuccessMessage(`Compte créé avec succès pour ${newProfile.name} ! Ouverture de votre espace...`);
    setTimeout(() => {
      registerUser(newProfile);
    }, 600);
  };

  // Populate form with demo credentials
  const fillDemoCredentials = (role: UserRole) => {
    const demo = DEMO_PROFILES.find((p) => p.role === role);
    if (!demo) return;

    setSelectedRole(role);
    setIdentifier(demo.phone);
    setPassword(demo.password || 'agri2026');
    setErrorMessage(null);
    setAuthTab('login');

    // Trigger subtle visual pulse
    setHighlightField(true);
    setTimeout(() => setHighlightField(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064E3B] via-emerald-950 to-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Decorative background glow */}
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Flag of Congo & Language selector */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 py-1">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-5 rounded-xs shadow-sm border border-emerald-700/80 shrink-0"
            viewBox="0 0 30 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Drapeau de la République du Congo"
          >
            <rect width="30" height="20" fill="#009543" />
            <polygon points="0,20 10,20 30,0 20,0" fill="#FBDE4A" />
            <polygon points="10,20 30,20 30,0" fill="#DC241F" />
          </svg>
          <div className="leading-tight">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white block">
              République du Congo
            </span>
            <span className="text-[10px] text-emerald-300 font-medium hidden sm:block">
              Ministère de l'Agriculture, de l'Élevage et de la Pêche · Portail Vivrier
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-emerald-900/70 border border-emerald-700/60 p-1 rounded-xl text-xs backdrop-blur-md">
          {[
            { code: 'fr' as const, label: 'FR' },
            { code: 'ln' as const, label: 'Lingala' },
            { code: 'kt' as const, label: 'Kituba' },
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-xs ${
                language === item.code
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-4 sm:my-8 z-10 space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2.5 mx-auto shadow-2xl flex items-center justify-center border-2 border-emerald-400">
            <img
              src="/assets/aistudio/Logo_feuille_verte__co-technologique_connect_e_0933bc6b.png"
              alt="Logo AgriLink Congo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              AGRILINK CONGO
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-300 mt-0.5">
              {t.slogan}
            </p>
          </div>

          <p className="text-xs text-emerald-200/80 max-w-lg mx-auto leading-relaxed hidden sm:block">
            Espace d'authentification des acteurs de la chaîne de valeur vivrière en République du Congo.
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-emerald-800/40 dark:border-emerald-700/40 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden transition-all">
          {/* Segmented Top Tabs: Connexion vs Créer un compte */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/50 p-1.5 gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                authTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Connexion à mon espace</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                authTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Créer un compte acteur</span>
            </button>
          </div>

          <div className="p-5 sm:p-8">
            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* TAB 1: AUTHENTICATION FORM */}
            {authTab === 'login' && (
              <div className="space-y-6">
                {/* 1. Actor Role Selector Chips */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    1. Choisissez votre catégorie d'acteur :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {(Object.keys(roleConfigs) as UserRole[]).map((roleKey) => {
                      const cfg = roleConfigs[roleKey];
                      const Icon = cfg.icon;
                      const isSelected = selectedRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => {
                            setSelectedRole(roleKey);
                            // Pre-fill matching phone if user hasn't typed custom phone
                            const demo = DEMO_PROFILES.find((p) => p.role === roleKey);
                            if (demo) {
                              setIdentifier(demo.phone);
                              setPassword(demo.password || 'agri2026');
                            }
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/60 dark:bg-slate-850/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                            {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                          </div>
                          <span className="text-xs font-bold leading-tight truncate block">
                            {cfg.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Chaque acteur dispose d'un espace strictement dédié avec ses outils métier autorisés.</span>
                  </p>
                </div>

                {/* 2. Login Form with Inputs */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Phone / Identifier Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Numéro de téléphone (+242) ou Identifiant :
                    </label>
                    <div
                      className={`relative flex items-center rounded-xl border bg-white dark:bg-slate-950 transition-all ${
                        highlightField ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <div className="px-3 py-2.5 flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 select-none bg-slate-50 dark:bg-slate-900 rounded-l-xl">
                        <span>🇨🇬</span>
                        <span>+242</span>
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="06 612 34 56 ou email"
                        required
                        className="w-full px-3.5 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                      />
                      <Smartphone className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                    </div>
                  </div>

                  {/* Password Input with show/hide */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Mot de passe ou Code secret :
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <div
                      className={`relative flex items-center rounded-xl border bg-white dark:bg-slate-950 transition-all ${
                        highlightField ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <div className="pl-3.5 text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options: Remember me & Help */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Mémoriser ma session</span>
                    </label>

                    <span className="text-[11px] text-slate-400">
                      Rôle actif : <strong className="text-emerald-700 dark:text-emerald-300">{roleConfigs[selectedRole].shortLabel}</strong>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#159447] hover:bg-emerald-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Se connecter à l'espace {roleConfigs[selectedRole].shortLabel}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: REGISTRATION FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-200">
                  <p className="font-semibold">Inscription rapide d'un nouvel acteur vivrier :</p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                    Créez votre profil avec vos coordonnées congolaises pour accéder immédiatement à votre espace personnalisé.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nom complet ou Raison sociale de l'organisation :
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
                    <User className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Brice Malonga ou GIE Maraîchers du Pool"
                      required
                      className="w-full px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Catégorie d'acteur :
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="farmer">Agriculteur / Maraîcher individuel</option>
                      <option value="cooperative">Coopérative / Groupement agricole</option>
                      <option value="transporter">Transporteur frigorifique agréé</option>
                      <option value="buyer">Acheteur grossiste en vivres</option>
                    </select>
                  </div>

                  {/* Location Department */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Département / Bassin de production :
                    </label>
                    <select
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pool (Kinkala · Mindouli)">Pool (Kinkala · Mindouli)</option>
                      <option value="Bouenza (Nkayi · Madingou)">Bouenza (Nkayi · Madingou)</option>
                      <option value="Niari (Dolisie · Mossendjo)">Niari (Dolisie · Mossendjo)</option>
                      <option value="Brazzaville (Bacongo · Talangaï)">Brazzaville (Bacongo · Talangaï)</option>
                      <option value="Pointe-Noire (Tié-Tié · Lumumba)">Pointe-Noire (Tié-Tié · Lumumba)</option>
                      <option value="Plateaux (Djambala · Ngo)">Plateaux (Djambala · Ngo)</option>
                      <option value="Cuvette (Owando · Oyo)">Cuvette (Owando · Oyo)</option>
                      <option value="Sangha (Ouesso · Pokola)">Sangha (Ouesso · Pokola)</option>
                    </select>
                  </div>
                </div>

                {/* Phone & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Numéro de téléphone (+242) :
                    </label>
                    <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
                      <div className="px-2.5 py-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-l-xl border-r border-slate-200 dark:border-slate-800">
                        +242
                      </div>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="06 123 45 67"
                        required
                        className="w-full px-3 py-2 text-sm bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mot de passe d'accès :
                    </label>
                    <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Au moins 4 caractères"
                        required
                        className="w-full px-3 py-2 text-sm bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#159447] hover:bg-emerald-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Créer mon compte & Accéder à mon espace dédié</span>
                </button>
              </form>
            )}
          </div>

          {/* SECONDARY SECTION: Preconfigured Demo Accounts Helper */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Identifiants préconfigurés pour essai immédiat :</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Cliquez sur un profil pour préremplir automatiquement le formulaire ci-dessus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {DEMO_PROFILES.map((profile) => {
                const cfg = roleConfigs[profile.role];
                const Icon = cfg.icon;
                const isCurrent = identifier === profile.phone;
                return (
                  <div
                    key={profile.id}
                    onClick={() => fillDemoCredentials(profile.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer group flex flex-col justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${cfg.badgeBg} ${cfg.badgeText}`}>
                          {cfg.shortLabel}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {profile.name}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                        {profile.phone}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        mdp: {profile.password}
                      </p>
                    </div>

                    <div className="pt-2 mt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-emerald-600 group-hover:text-emerald-700">
                      <span>Remplir champs</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Réinitialisation du mot de passe</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SMS de réinitialisation envoyé !</span>
                </p>
                <p>
                  Un code temporaire à 6 chiffres a été envoyé par SMS (simulé) au numéro <strong>{forgotPhone || identifier}</strong> via le réseau Airtel / MTN Congo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="w-full mt-2 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                >
                  Fermer et retourner à la connexion
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Entrez votre numéro de téléphone congolais pour recevoir un SMS de déblocage avec votre code provisoire :
                </p>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Numéro de téléphone (+242) :
                  </label>
                  <input
                    type="text"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="Ex: 06 612 34 56"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Envoyer le code SMS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center z-10 pt-3 text-[11px] text-emerald-300/80">
        <p>
          AgriLink Congo · Plateforme Vivrière Numérique Nationale · République du Congo
        </p>
        <p className="text-[10px] text-emerald-400/60 mt-0.5">
          Surveillance FreshGuard Stock & Route · Paiements Séquestres Mobile Money MTN & Airtel
        </p>
      </footer>
    </div>
  );
};
