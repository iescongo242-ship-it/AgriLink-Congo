import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product, OrderItem } from '../../types';
import {
  Users,
  Sprout,
  Activity,
  Truck,
  Coins,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Building,
} from 'lucide-react';
import { formatFCFA } from '../../utils/calculations';

export const CoopSpace: React.FC = () => {
  const { currentProfile, products, orders, setActiveTab } = useApp();

  const totalCoopStock = products.reduce((acc: number, p: Product) => acc + p.availableStock, 0);
  const totalVolumeManaged = products.reduce((acc: number, p: Product) => acc + p.totalQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-teal-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-600/60 text-xs font-semibold text-teal-200">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Espace Dédié Coopérative & Groupement Agricole</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentProfile.name}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Union de 45 petits producteurs dans la Bouenza et le Niari (Dolisie / Nkayi) · Mutualisation des stocks, négociation groupée avec les grossistes et logistique mutualisée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('producer')}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sprout className="w-4 h-4" />
            <span>+ Publier stock groupé</span>
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 border border-white/20 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Réserver camion 5T</span>
          </button>
        </div>
      </div>

      {/* 4 Coop KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Membres Adhérents</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            45 exploitants
          </p>
          <span className="text-[11px] text-teal-600 font-medium">
            Bouenza, Niari et Lékoumou
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Volume Groupé Actif</span>
          <p className="text-3xl font-black text-teal-600 dark:text-teal-400 tabular-nums font-mono">
            {totalCoopStock.toLocaleString()} kg
          </p>
          <span className="text-[11px] text-slate-400">
            Stock total sous gestion : {totalVolumeManaged.toLocaleString()} kg
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Sondes FreshGuard Hangars</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            3 hangars
          </p>
          <span className="text-[11px] text-slate-400">
            Dolisie, Nkayi et Madingou
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Ventes Mutualisées Sécurisées</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums font-mono">
            {formatFCFA(orders.reduce((acc: number, o: OrderItem) => acc + o.productTotal, 0))}
          </p>
          <span className="text-[11px] text-slate-400">
            Paiements séquestre MoMo
          </span>
        </div>
      </div>

      {/* Cooperative Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Stocks Groupés de la Coopérative
              </h3>
              <p className="text-xs text-slate-500">
                Lots consolidés pour négocier de meilleurs tarifs avec les grossistes de Brazzaville
              </p>
            </div>
            <button
              onClick={() => setActiveTab('producer')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>Ajouter un lot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {products.map((p: Product) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {p.location} · {p.variety}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {p.availableStock} kg restants
                  </span>
                  <span className="block text-[11px] text-emerald-600 font-mono">
                    {formatFCFA(p.pricePerUnit)} / kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooperative Community Guidance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Avantages de la Mutualisation
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
              <span className="font-bold text-teal-900 dark:text-teal-200 block mb-0.5">
                Économies d'échelle Transport
              </span>
              <p>
                Le transport groupé en camion 5 tonnes réduit le coût logistique par kg de 35% par rapport aux trajets individuels.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Capteurs FreshGuard Partagés
              </span>
              <p>
                La coopérative équipe ses hangars de Dolisie et Nkayi avec un boîtier central mutualisé pour tous les membres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
