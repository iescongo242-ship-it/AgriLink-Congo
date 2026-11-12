import React from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, RotateCcw, Cpu, Radio, ShieldCheck } from 'lucide-react';

export const PermanentDemoBanner: React.FC = () => {
  const {
    t,
    freshGuardConfig,
    executeDemoStep,
    resetToDefaultDemo,
    presentationStep,
    setPresentationStep,
  } = useApp();

  return (
    <aside
      aria-label="Avertissement démo et contrôles rapides"
      className="bg-emerald-950 text-emerald-100 border-b border-emerald-800/80 px-3 py-1.5 text-xs select-none sticky top-0 z-40 transition-colors shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Honesty badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.demoBadge}</span>
          </span>
          <span className="hidden sm:inline text-emerald-400/60">·</span>
          <span className="hidden md:inline text-emerald-300/80">
            MTN/Airtel simulé · USSD *140# code d'essai · République du Congo
          </span>
        </div>

        {/* Center / Right: Sensor indicator & presentation triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sensor source pill */}
          <div className="flex items-center gap-1 bg-emerald-900/90 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">
            {freshGuardConfig.source === 'real_esp32' ? (
              <>
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
                <span>Capteur ESP32 {freshGuardConfig.isConnected ? 'Connecté' : 'Recherche...'}</span>
              </>
            ) : (
              <>
                <Cpu className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Capteur : Simulation</span>
              </>
            )}
          </div>

          {/* Quick presentation tour button */}
          <button
            onClick={() => {
              if (presentationStep === null) {
                executeDemoStep(1);
              } else {
                setPresentationStep(null);
              }
            }}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-0.5 rounded text-[11px] transition shadow-xs cursor-pointer"
            title="Démarrer le parcours de démonstration en 13 étapes"
          >
            <PlayCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{presentationStep ? `Parcours : Étape ${presentationStep}/13` : 'Parcours Démo (4 min)'}</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser toutes les données de la démo à leur état initial ?')) {
                resetToDefaultDemo();
              }
            }}
            className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white px-2 py-0.5 rounded text-[11px] border border-emerald-700/40 transition cursor-pointer"
            title="Restaurer les données initiales de démonstration"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
