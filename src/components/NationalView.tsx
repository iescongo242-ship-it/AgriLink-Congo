import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Scale,
  MapPin,
  AlertTriangle,
  Building2,
  Users,
  Award,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const NationalView: React.FC = () => {
  const { products, orders, freshGuardReadings } = useApp();

  // Dynamic calculations based on application state
  const totalKgTraded = orders.reduce((acc, o) => acc + o.quantity, 0);
  const totalValueTraded = orders.reduce((acc, o) => acc + o.productTotal, 0);

  // Avoided food losses: baseline demo (1 450 kg) + delivered orders (which were preserved thanks to FreshGuard)
  const deliveredOrders = orders.filter((o) => o.deliveryStep === 'delivered');
  const deliveredKg = deliveredOrders.reduce((acc, o) => acc + o.quantity, 0);
  const totalAvoidedLossesKg = 1450 + deliveredKg;
  const totalAvoidedLossesFCFA = totalAvoidedLossesKg * 320; // Average basket price ~320 FCFA/kg

  // Average prices from products
  const avgPrices = products.map((p) => ({
    name: p.name,
    category: p.category,
    price: p.pricePerUnit,
    location: p.location,
  }));

  const departmentalStats = [
    { name: 'Pool (Kinkala, Mindouli)', harvests: '680 kg', value: '170 000 F', alertCount: 1, activeFarms: 34 },
    { name: 'Bouenza (Nkayi, Madingou)', harvests: '920 kg', value: '276 000 F', alertCount: 0, activeFarms: 52 },
    { name: 'Niari (Dolisie, Mossendjo)', harvests: '540 kg', value: '162 000 F', alertCount: 1, activeFarms: 28 },
    { name: 'Brazzaville (Périurbain)', harvests: '420 kg', value: '168 000 F', alertCount: 2, activeFarms: 19 },
    { name: 'Cuvette & Plateaux (Oyo, Djambala)', harvests: '310 kg', value: '105 000 F', alertCount: 0, activeFarms: 15 },
    { name: 'Sangha (Ouesso)', harvests: '350 kg', value: '122 500 F', alertCount: 0, activeFarms: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            <span>Vue Nationale · Observatoire des Pertes & Souveraineté Alimentaire</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tableau de bord agrégé pour le Ministère de l'Agriculture, les Banques de Développement et les Bailleurs de Fonds
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 font-semibold">
          Données de démonstration, pas des statistiques officielles
        </div>
      </div>

      {/* 4 Big Macro Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avoided Waste (kg) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Pertes de récoltes évitées</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {totalAvoidedLossesKg.toLocaleString()} kg
          </p>
          <span className="text-[11px] text-slate-400">
            Sauvés grâce aux alertes FreshGuard
          </span>
        </div>

        {/* Avoided Waste (FCFA Value) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Valeur vivrière préservée</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {formatFCFA(totalAvoidedLossesFCFA)}
          </p>
          <span className="text-[11px] text-slate-400">
            Revenu sécurisé pour les ménages ruraux
          </span>
        </div>

        {/* Total Traded Volume */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Volume total échangé</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono tabular-nums">
            {totalKgTraded.toLocaleString()} kg
          </p>
          <span className="text-[11px] text-slate-400">
            Transactions enregistrées sur la plateforme
          </span>
        </div>

        {/* Connected Ecosystem */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Exploitants & Transporteurs</span>
          <p className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono tabular-nums">
            160 actifs
          </p>
          <span className="text-[11px] text-slate-400">
            Connectés par Web & USSD *140#
          </span>
        </div>
      </div>

      {/* Departmental Performance Matrix & Food Security Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Departmental Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Agrégation des Flux par Département (Congo)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Départements pilotes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Département & Bassin</th>
                  <th className="pb-3 font-semibold">Volume Récolté</th>
                  <th className="pb-3 font-semibold">Valeur Marchande</th>
                  <th className="pb-3 font-semibold">Exploitants</th>
                  <th className="pb-3 font-semibold">Alertes Froid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {departmentalStats.map((dep, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dep.name}</span>
                    </td>
                    <td className="py-3 font-mono font-bold">{dep.harvests}</td>
                    <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {dep.value}
                    </td>
                    <td className="py-3 tabular-nums">{dep.activeFarms} paysans</td>
                    <td className="py-3">
                      {dep.alertCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[10px]">
                          {dep.alertCount} alerte
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Price Barometer by Commodity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Baromètre des Prix Moyens (FCFA/kg)</span>
              </h3>
              <span className="text-[10px] text-slate-400">Marché Congo</span>
            </div>

            <div className="space-y-3 mt-3">
              {avgPrices.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Réf : {item.location}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {formatFCFA(item.price)}
                    </span>
                    <span className="text-[9px] text-slate-400 block">/ kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <strong>Indice de stabilisation :</strong> Les prix du manioc et maïs affichent une volatilité réduite de 18% sur les corridors équipés en suivi FreshGuard.
          </div>
        </div>
      </div>
    </div>
  );
};
