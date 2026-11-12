import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const PresentationTourModal: React.FC = () => {
  const { presentationStep, setPresentationStep, executeDemoStep, resetToDefaultDemo } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  if (presentationStep === null) return null;

  const STEPS_DATA = [
    {
      step: 1,
      title: 'Publication d une récolte (Manioc)',
      speaker: 'Jean Mavoungou (Agriculteur)',
      targetTab: 'producer',
      description: 'L agriculteur enregistre 500 kg de manioc frais à 250 FCFA/kg depuis Kinkala (Pool). Le formulaire valide les quantités et le calendrier agronomique.',
      actionLabel: 'Publier la récolte au Marché',
      keyPoint: 'Formulaire validé, calcul automatique de conservation initiale.',
    },
    {
      step: 2,
      title: 'Disponibilité instantanée au Marché',
      speaker: 'Présentateur / Marché',
      targetTab: 'market',
      description: 'Le produit apparaît immédiatement dans le catalogue avec photo, stock disponible (500 kg) et prix unitaire.',
      actionLabel: 'Explorer le Marché',
      keyPoint: 'Mise à jour en temps réel sans rechargement de page.',
    },
    {
      step: 3,
      title: 'Alerte préventive FreshGuard Stock',
      speaker: 'Capteur IoT FreshGuard',
      targetTab: 'freshguard',
      description: 'Le capteur détecte une montée en température et déclenche une alerte préventive : dégradation estimée sous 3 jours si rien n est fait !',
      actionLabel: 'Simuler la montée thermique (+3°C)',
      keyPoint: 'Prévention proactive des pertes post-récolte avant pourrissement.',
    },
    {
      step: 4,
      title: 'Réservation acheteur & Paiement Séquestre',
      speaker: 'Mireille Ngoma (Acheteuse grossiste)',
      targetTab: 'market',
      description: 'Alerte vue ! Mireille réserve 100 kg et paie par MTN Mobile Money. Les fonds (27 500 FCFA) sont bloqués en séquestre inviolable.',
      actionLabel: 'Réserver 100 kg & Bloquer les fonds',
      keyPoint: 'Paiement sécurisé : l argent ne sera débloqué qu à bonne réception.',
    },
    {
      step: 5,
      title: 'Déduction instantanée du stock (500 → 400 kg)',
      speaker: 'Vérification Système',
      targetTab: 'market',
      description: 'Le stock disponible passe exactement de 500 kg à 400 kg. Aucun risque de double vente.',
      actionLabel: 'Vérifier le stock (400 kg)',
      keyPoint: 'Règle stricte : stock initial 500 kg - 100 kg réservés = 400 kg.',
    },
    {
      step: 6,
      title: 'Attribution du Transporteur Frigo',
      speaker: 'Marcel Okemba (Transporteur)',
      targetTab: 'transport',
      description: 'Marcel Okemba accepte de transporter le lot dans son camion réfrigéré équipé d une sonde FreshGuard Route.',
      actionLabel: 'Assigner Marcel Okemba',
      keyPoint: 'Logistique intégrée reliant le Pool à Brazzaville.',
    },
    {
      step: 7,
      title: 'Livraison « En route » & Télématique Froid',
      speaker: 'FreshGuard Route (Télématique)',
      targetTab: 'transport',
      description: 'Le camion roule sur la RN1. La sonde transmet la température en direct (24.2°C). La carte SVG anime le tracé.',
      actionLabel: 'Faire avancer le camion « En route »',
      keyPoint: 'Surveillance continue de la chaîne du froid en direct.',
    },
    {
      step: 8,
      title: 'Arrivée à destination & Rapport d Audit',
      speaker: 'Système AgriLink',
      targetTab: 'transport',
      description: 'Le camion arrive au Marché Total. Le système génère automatiquement le rapport d audit de conformité thermique.',
      actionLabel: 'Valider l arrivée du camion',
      keyPoint: 'Rapport certifié : max 25.4°C, conforme au seuil de 30°C.',
    },
    {
      step: 9,
      title: 'Validation réception & Libération des fonds',
      speaker: 'Mireille Ngoma (Acheteuse)',
      targetTab: 'transactions',
      description: 'Mireille inspecte le lot sain et valide la conformité. Les fonds sont automatiquement débloqués : net producteur versé + 5% commission AgriLink.',
      actionLabel: 'Confirmer la réception et libérer le séquestre',
      keyPoint: 'Rémunération garantie pour le paysan et le chauffeur.',
    },
    {
      step: 10,
      title: 'Statut de commande « Confirmée & Livrée »',
      speaker: 'Registre financier',
      targetTab: 'transactions',
      description: 'La transaction est clôturée et archivée avec toutes les preuves de pesée et de température.',
      actionLabel: 'Consulter l historique des transactions',
      keyPoint: 'Transparence comptable totale pour tous les acteurs.',
    },
    {
      step: 11,
      title: 'Impact Macroéconomique & Vue Nationale',
      speaker: 'Ministère / Banques (Jury)',
      targetTab: 'national',
      description: 'Les 100 kg sauvés s ajoutent au compteur national des pertes évitées et des flux financiers vivriers.',
      actionLabel: 'Afficher la Vue Nationale',
      keyPoint: 'Données décisionnelles stratégiques pour la souveraineté alimentaire.',
    },
    {
      step: 12,
      title: 'Variante Litige : Rupture Chaîne du Froid',
      speaker: 'Scénario de test du Jury',
      targetTab: 'transport',
      description: 'Que se passe-t-il si le frigo tombe en panne (>30°C) ? Le rapport signale « Seuil Dépassé », le paiement est retenu et un litige s ouvre !',
      actionLabel: 'Tester la rupture du froid (>30°C) & Litige',
      keyPoint: 'Preuve irréfutable protégeant l acheteur contre les avaries.',
    },
    {
      step: 13,
      title: 'Inclusion Rurale : Démonstration USSD *140#',
      speaker: 'Paysan sans smartphone ni 4G',
      targetTab: 'ussd',
      description: 'Sur un téléphone à touches basique, le producteur compose *140#, choisit le Lingala ou Kituba, et consulte ou publie ses récoltes en direct.',
      actionLabel: 'Ouvrir le téléphone USSD *140#',
      keyPoint: 'Zéro exclusion : fonctionne sur tout téléphone 2G en zone blanche.',
    },
  ];

  const currentStepData = STEPS_DATA[presentationStep - 1] || STEPS_DATA[0];

  const handleNext = () => {
    if (presentationStep < STEPS_DATA.length) {
      executeDemoStep(presentationStep + 1);
    } else {
      setPresentationStep(null);
    }
  };

  const handlePrev = () => {
    if (presentationStep > 1) {
      executeDemoStep(presentationStep - 1);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full px-2 sm:px-0">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-600 dark:border-emerald-500 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-200">
              Parcours de Démonstration ({presentationStep}/13)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition"
              title={isMinimized ? 'Agrandir' : 'Réduire'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setPresentationStep(null)}
              className="p-1 rounded text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition"
              title="Quitter le mode présentation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content body (hidden if minimized) */}
        {!isMinimized && (
          <div className="p-4 space-y-3">
            {/* Step badge & Speaker */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Étape {currentStepData.step} : {currentStepData.title}
              </span>
              <span className="text-slate-500 dark:text-slate-400 italic">
                Rôle : {currentStepData.speaker}
              </span>
            </div>

            {/* Step explanation */}
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Key point for the jury */}
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Point clé Jury :</strong> {currentStepData.keyPoint}
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => executeDemoStep(presentationStep)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentStepData.actionLabel}</span>
            </button>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={handlePrev}
                disabled={presentationStep === 1}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Réinitialiser la démonstration ?')) {
                    resetToDefaultDemo();
                  }
                }}
                className="text-[10px] text-slate-600 hover:text-red-500 dark:text-slate-400 flex items-center gap-1"
                title="Remettre les données à zéro"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition"
              >
                <span>{presentationStep === STEPS_DATA.length ? 'Terminer' : 'Suivant'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
