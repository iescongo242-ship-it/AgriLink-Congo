import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';
import {
  Truck,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Snowflake,
  FileCheck,
  MapPin,
} from 'lucide-react';
import { formatFCFA } from '../../utils/calculations';

export const TransporterSpace: React.FC = () => {
  const {
    currentProfile,
    orders,
    advanceDeliveryStep,
    inTransitTruckTemp,
    heatStock,
    coolStock,
    freshGuardConfig,
    setActiveTab,
  } = useApp();

  const activeDeliveries = orders.filter((o: OrderItem) => o.deliveryStep !== 'delivered');
  const deliveredOrders = orders.filter((o: OrderItem) => o.deliveryStep === 'delivered');
  const totalEarnedDelivery = deliveredOrders.reduce((acc: number, o: OrderItem) => acc + o.deliveryFee, 0);

  const isColdChainBreached = inTransitTruckTemp >= freshGuardConfig.tempCriticalThreshold;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-orange-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/80 border border-orange-600/60 text-xs font-semibold text-orange-200">
            <Truck className="w-3.5 h-3.5 text-orange-400" />
            <span>Espace Dédié Transporteur Frigorifique Agréé</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentProfile.name}
          </h2>
          <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed">
            Corridor RN1 Brazzaville ↔ Pool ↔ Pointe-Noire · Camion Isotherme 3.5T équipé d'une sonde de télématique FreshGuard Route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('transport')}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Suivi Route & Carte RN1</span>
          </button>
        </div>
      </div>

      {/* 4 Transporter KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Missions Actives</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            {activeDeliveries.length}
          </p>
          <span className="text-[11px] text-orange-600 font-medium">
            En cours d'acheminement
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Gains Livraison Encaissés</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {formatFCFA(totalEarnedDelivery)}
          </p>
          <span className="text-[11px] text-slate-400">
            Frais de transport perçus
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Sonde Frigo Connectée</span>
          <p
            className={`text-3xl font-black tabular-nums font-mono ${
              isColdChainBreached ? 'text-red-600 animate-pulse' : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {inTransitTruckTemp}°C
          </p>
          <span className="text-[11px] text-slate-400">
            {isColdChainBreached ? '⚠️ ALERTE : Seuil 30°C dépassé' : 'Norme respectée'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Conformité Chaîne du Froid</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            {isColdChainBreached ? 'Rupture' : '100%'}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Audit certifié pour déblocage des fonds
          </span>
        </div>
      </div>

      {/* Active Cargo Missions with 1-click advance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Mes Cargaisons en Cours & Validation d'Étapes
              </h3>
              <p className="text-xs text-slate-500">
                Faites progresser vos livraisons pour générer le rapport d'audit et débloquer les fonds
              </p>
            </div>
            <button
              onClick={() => setActiveTab('transport')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Carte GPS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((ord: OrderItem) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {ord.orderNumber}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {ord.productName} ({ord.quantity} kg)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Acheteur : {ord.buyerName} · Frais de transport :{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {formatFCFA(ord.deliveryFee)}
                    </strong>
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">
                    Étape actuelle : {ord.deliveryStep}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {ord.deliveryStep !== 'delivered' ? (
                    <button
                      onClick={() => advanceDeliveryStep(ord.id)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Avancer étape</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Livré & Réceptionné</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Truck Temperature Control Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                <span>Contrôleur Frigo Camion</span>
              </h3>
              <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded">
                RN1 En direct
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center space-y-1.5 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-500">Température de caisse :</span>
              <p
                className={`text-4xl font-black tabular-nums font-mono ${
                  isColdChainBreached ? 'text-red-600 animate-pulse' : 'text-blue-600'
                }`}
              >
                {inTransitTruckTemp}°C
              </p>
              <p className="text-[11px] text-slate-400">
                Seuil maximum contractuel : {freshGuardConfig.tempCriticalThreshold}°C
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={heatStock}
                className="flex-1 py-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200 flex items-center justify-center gap-1 cursor-pointer"
                title="Simuler une panne du groupe frigo (>30°C)"
              >
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Chauffer (&gt;30°C)</span>
              </button>
              <button
                onClick={coolStock}
                className="flex-1 py-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                <span>Rétablir froid</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
            Garantie séquestre : Dès validation par l'acheteur, votre rémunération de transport est immédiatement virée sur votre compte Mobile Money.
          </div>
        </div>
      </div>
    </div>
  );
};
