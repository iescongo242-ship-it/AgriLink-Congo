import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PROFILES } from '../data/initialData';
import {
  Settings,
  Globe,
  Sliders,
  Cpu,
  RotateCcw,
  ShieldCheck,
  Check,
  Smartphone,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    currentProfile,
    setCurrentProfile,
    freshGuardConfig,
    updateFreshGuardConfig,
    resetToDefaultDemo,
    isDarkMode,
    setIsDarkMode,
    t,
  } = useApp();

  const [espUrl, setEspUrl] = useState(freshGuardConfig.esp32Endpoint);
  const [tempThreshold, setTempThreshold] = useState(freshGuardConfig.tempCriticalThreshold);
  const [shelfLifeThreshold, setShelfLifeThreshold] = useState(
    freshGuardConfig.shelfLifeAlertThreshold
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateFreshGuardConfig({
      esp32Endpoint: espUrl,
      tempCriticalThreshold: Number(tempThreshold),
      shelfLifeAlertThreshold: Number(shelfLifeThreshold),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>Paramètres de l'Application & Démonstration</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personnalisation des langues, seuils IoT et gestion du système
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Paramètres enregistrés avec succès.</span>
        </div>
      )}

      {/* Language Selector Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Langue de l'Interface (Français, Lingala, Kituba)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          {t.provisionalNotice} Les termes agricoles sont adaptés au contexte local congolais.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'fr' as const, title: 'Français (Congo)', subtitle: 'Langue officielle et commerciale' },
            { id: 'ln' as const, title: 'Lingala', subtitle: 'Brazzaville, Pool, Nord, RDC' },
            { id: 'kt' as const, title: 'Kituba / Munukutuba', subtitle: 'Pointe-Noire, Niari, Bouenza' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                language === item.id
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</span>
                {language === item.id && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Selector Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Profil Actif (Simulation des 4 Acteurs Clés)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEMO_PROFILES.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setCurrentProfile(prof)}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
                currentProfile.id === prof.id
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {prof.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {prof.name}
                  </span>
                  {currentProfile.id === prof.id && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {prof.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{prof.location}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FreshGuard Thresholds & Sensor Source */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Configuration des Seuils d'Alerte FreshGuard
          </h3>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Seuil critique de température (°C) :
              </label>
              <input
                type="number"
                min="20"
                max="45"
                value={tempThreshold}
                onChange={(e) => setTempThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Standard : 30°C pour tomates et vivres frais.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Seuil d'alerte jours restants (jours) :
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={shelfLifeThreshold}
                onChange={(e) => setShelfLifeThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Déclenche l'alerte rouge si la conservation tombe à ce niveau ou moins.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
            >
              Enregistrer les seuils
            </button>
          </div>
        </form>
      </div>

      {/* Demo Reset Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-red-200 dark:border-red-900/60 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialisation de la Démonstration (Jury)</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Restaure les 500 kg initiaux de manioc de Jean Mavoungou, les 3 commandes de test, les seuils standards et efface l'historique de navigation local.
        </p>

        <button
          onClick={() => {
            if (window.confirm('Confirmer la réinitialisation complète de la démonstration ?')) {
              resetToDefaultDemo();
              alert('Démonstration réinitialisée avec succès !');
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          {t.resetDemo}
        </button>
      </div>
    </div>
  );
};
