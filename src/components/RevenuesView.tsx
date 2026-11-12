import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS, AGRO_TRAININGS } from '../data/initialData';
import {
  Coins,
  Percent,
  CheckCircle,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Megaphone,
  ArrowRight,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const RevenuesView: React.FC = () => {
  const { orders } = useApp();

  const [activeSubId, setActiveSubId] = useState<string>('plan-essential');
  const [enrolledTrainings, setEnrolledTrainings] = useState<string[]>(['train-01']);
  const [hardwareOrderSuccess, setHardwareOrderSuccess] = useState<string | null>(null);

  // Live calculation of 5% commissions collected from executed orders
  const totalGMV = orders.reduce((acc, o) => acc + o.productTotal, 0);
  const totalCommissionEarned = orders.reduce((acc, o) => acc + o.commissionFee, 0);
  const totalDeliveryFees = orders.reduce((acc, o) => acc + o.deliveryFee, 0);

  const handleEnrollTraining = (id: string, title: string) => {
    if (!enrolledTrainings.includes(id)) {
      setEnrolledTrainings((prev) => [...prev, id]);
      alert(`Inscription simulée réussie à la formation : "${title}". (Données de démonstration)`);
    }
  };

  const handleOrderHardware = (type: 'buy' | 'rent') => {
    setHardwareOrderSuccess(
      type === 'buy'
        ? 'Commande simulée : Capteur FreshGuard Stock (25 000 FCFA). Livraison sous 48h à Brazzaville.'
        : 'Souscription location : Capteur FreshGuard (2 000 FCFA / mois avec maintenance incluse).'
    );
    setTimeout(() => setHardwareOrderSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-emerald-600" />
            <span>Modèle Économique & Sources de Revenus</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Démonstration de la viabilité financière · Tous les prix sont des hypothèses de travail à valider sur le terrain
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
          Modèle Hybride B2B & B2C
        </div>
      </div>

      {/* 3 Main Revenue Pillars Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">1. Commission 5% sur Transactions</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {formatFCFA(totalCommissionEarned)}
          </p>
          <span className="text-[11px] text-slate-400">
            Sur un volume total de {formatFCFA(totalGMV)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2. Abonnements Professionnels</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            dès 1 000 F / mois
          </p>
          <span className="text-[11px] text-slate-400">
            Essentiel, Coopératives & Transporteurs
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">3. Services IoT & Formations</span>
            <Cpu className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            2 000 à 25 000 F
          </p>
          <span className="text-[11px] text-slate-400">
            Vente/Location de capteurs + Modules e-learning
          </span>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Formules d'Abonnement Mensuel (Simulation de Souscription)
          </h3>
          <p className="text-xs text-slate-500">
            Tarifs adaptés au pouvoir d'achat des coopératives et exploitants du Bassin du Congo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = activeSubId === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {plan.targetRole}
                    </span>
                    {plan.isPopular && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                        Recommandé
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {formatFCFA(plan.priceMonthly)}
                      </span>
                      <span className="text-xs text-slate-500">/ mois</span>
                    </div>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveSubId(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ Formule active (Démo)' : 'Choisir cette formule'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FreshGuard Hardware & Agro-Trainings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FreshGuard Hardware IoT Sales & Rent */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Vente & Location des Capteurs FreshGuard (Hardware)
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Pour équiper les hangars villageois et les camions de la RN1, AgriLink assemble et déploie les boîtiers électroniques étanches avec carte ESP32, sonde DHT22 et capteur de fermentation.
          </p>

          {hardwareOrderSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              {hardwareOrderSuccess}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Achat Boîtier</span>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
                  25 000 FCFA
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Propriété définitive · Garantie 2 ans · Idéal coopérative
                </p>
              </div>
              <button
                onClick={() => handleOrderHardware('buy')}
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Commander l'achat
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Location Mensuelle</span>
                <p className="text-lg font-black text-blue-700 dark:text-blue-400 font-mono mt-1">
                  2 000 FCFA <span className="text-xs font-normal text-slate-500">/ mois</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Zéro investissement initial · Remplacement en cas de panne
                </p>
              </div>
              <button
                onClick={() => handleOrderHardware('rent')}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Louer à 2 000 F/mois
              </button>
            </div>
          </div>
        </div>

        {/* Agro-Trainings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Formations Agricoles & Bonnes Pratiques Post-Récolte
            </h3>
          </div>

          <div className="space-y-3">
            {AGRO_TRAININGS.map((tr) => {
              const isEnrolled = enrolledTrainings.includes(tr.id);
              return (
                <div
                  key={tr.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {tr.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {tr.duration} · {tr.instructor}
                    </p>
                    <p className="text-[11px] font-mono font-bold text-emerald-600">
                      {tr.priceFCFA === 0 ? 'Gratuit' : formatFCFA(tr.priceFCFA)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEnrollTraining(tr.id, tr.title)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isEnrolled
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isEnrolled ? '✓ Inscrit' : "S'inscrire"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ethical Advertising Slot (Partner Spotlight) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.2 rounded">
                Espace Partenaire Agréé
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Micro-Assurance Récolte Congo (CERECA / ARC)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Protégez vos champs contre les inondations et la sécheresse dans le Pool et la Bouenza. Subventionné à 40%.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Ouverture simulée du partenaire micro-assurance.')}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition shrink-0 cursor-pointer"
        >
          En savoir plus
        </button>
      </div>
    </div>
  );
};
