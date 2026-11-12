import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  ShoppingBag,
  Truck,
  AlertTriangle,
  ArrowRight,
  SunMedium,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Activity,
  Flame,
  Snowflake,
  Wind,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const DashboardView: React.FC = () => {
  const {
    currentProfile,
    products,
    orders,
    freshGuardReadings,
    freshGuardConfig,
    setActiveTab,
    heatStock,
    coolStock,
    ventilateStock,
    t,
  } = useApp();

  const latestReading = freshGuardReadings[freshGuardReadings.length - 1];

  // Dynamic KPI counts
  const activeHarvestsCount = products.filter((p) => p.availableStock > 0).length;
  const activeReservationsCount = orders.filter((o) => o.escrowStatus === 'locked').length;
  const activeDeliveriesCount = orders.filter(
    (o) => o.deliveryStep === 'in_transit' || o.deliveryStep === 'accepted'
  ).length;
  const activeAlertsCount = freshGuardReadings.filter((r) => r.isAlert).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_congo_agriculture_1794476791432.jpg"
            alt="Agriculture en République du Congo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/40" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-semibold text-emerald-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Plateforme Vivrière Nationale · République du Congo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2">
            {t.welcome} {currentProfile.name} !
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6">
            {t.overviewSub} Reliez vos récoltes aux acheteurs de Brazzaville et Pointe-Noire, sécurisez vos paiements par séquestre et surveillez vos stocks avec FreshGuard.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('producer')}
              className="px-4 py-2.5 rounded-xl bg-[#159447] hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              <span>Publier une récolte</span>
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explorer le Marché</span>
            </button>
            <button
              onClick={() => setActiveTab('ussd')}
              className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <span>Accès USSD *140#</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dynamic KPI Cards with Distinct Color Codes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Harvests (Green) */}
        <div
          onClick={() => setActiveTab('market')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.kpiHarvests}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {activeHarvestsCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              lots disponibles
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 transition">
            <span>Consulter le catalogue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 2: Active Reservations (Blue) */}
        <div
          onClick={() => setActiveTab('transactions')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.kpiReservations}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {activeReservationsCount}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              en séquestre MoMo
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition">
            <span>Voir les commandes</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 3: In-transit Deliveries (Orange) */}
        <div
          onClick={() => setActiveTab('transport')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-orange-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.kpiDeliveries}
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {activeDeliveriesCount}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              sur la RN1
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-orange-600 transition">
            <span>Suivi GPS & température</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 4: FreshGuard Alerts (Red) */}
        <div
          onClick={() => setActiveTab('freshguard')}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm transition cursor-pointer group ${
            activeAlertsCount > 0
              ? 'border-red-400 dark:border-red-800 bg-red-50/20 dark:bg-red-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-red-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.kpiFreshGuard}
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {activeAlertsCount}
            </span>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              alertes actives
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-red-600 transition">
            <span>Diagnostiquer les stocks</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Main Grid: FreshGuard Live Telemetry + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: FreshGuard Stock Widget with Demo Action Controls */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  FreshGuard Stock · Télémétrie Entrepôt (Kinkala)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Source : {freshGuardConfig.source === 'real_esp32' ? 'Capteur Réel ESP32' : 'Simulation interne'} · Seuil max : {freshGuardConfig.tempCriticalThreshold}°C
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={heatStock}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 hover:bg-red-200 flex items-center gap-1 transition"
                title="Déclencher une hausse thermique (+3°C) pour tester les alertes"
              >
                <Flame className="w-3 h-3 text-red-600" />
                <span>Chauffer (+3°C)</span>
              </button>
              <button
                onClick={coolStock}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 hover:bg-blue-200 flex items-center gap-1 transition"
                title="Refroidir le stock (-3°C)"
              >
                <Snowflake className="w-3 h-3 text-blue-600" />
                <span>Refroidir (-3°C)</span>
              </button>
              <button
                onClick={ventilateStock}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1 transition"
                title="Évacuer l'éthylène accumulé"
              >
                <Wind className="w-3 h-3 text-emerald-600" />
                <span>Ventiler</span>
              </button>
            </div>
          </div>

          {/* 4 Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.temperature}
              </span>
              <p
                className={`text-2xl font-black mt-1 tabular-nums ${
                  (latestReading?.temperature || 24) >= freshGuardConfig.tempCriticalThreshold
                    ? 'text-red-600 dark:text-red-400 animate-pulse'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {latestReading?.temperature || 24.5}°C
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">
                {(latestReading?.temperature || 24) >= freshGuardConfig.tempCriticalThreshold
                  ? 'CRITIQUE (Alerte)'
                  : 'Zone idéale'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.humidity}
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {latestReading?.humidity || 75}%
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">
                {(latestReading?.humidity || 75) > 82 ? 'Risque moisissure' : 'Optimal'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.gasIndex}
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {latestReading?.gasIndex || 1.0}
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">
                {(latestReading?.gasIndex || 1.0) > 1.15 ? 'Fermentation' : 'Air sain'}
              </span>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                (latestReading?.estimatedDays || 7) <= freshGuardConfig.shelfLifeAlertThreshold
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 text-red-700 dark:text-red-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              <span className="text-[11px] font-semibold">
                {t.estimatedShelfLife}
              </span>
              <p className="text-2xl font-black mt-1 tabular-nums">
                {latestReading?.estimatedDays || 7} {t.days}
              </p>
              <span className="text-[10px]">
                {(latestReading?.estimatedDays || 7) <= freshGuardConfig.shelfLifeAlertThreshold
                  ? 'Vente urgente conseillée'
                  : 'Fraîcheur préservée'}
              </span>
            </div>
          </div>

          {/* Quick status message */}
          {latestReading?.isAlert ? (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{latestReading.alertReason || t.alertDanger}</span>
              </div>
              <button
                onClick={() => setActiveTab('market')}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] transition shrink-0"
              >
                Écouler au Marché
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t.alertNormal} · Les cossettes de manioc et les tomates sont conservées dans les normes recommandées.
              </span>
            </div>
          )}
        </div>

        {/* Right Col: Regional Weather & Harvest Calendar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-amber-500" />
                <span>Météo & Calendrier Congo</span>
              </h3>
              <span className="text-[10px] text-slate-500">Brazzaville / Pool</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Aujourd'hui</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  29°C · Humidité 78% · Ensoleillé
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Demain (Prévision)</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  32°C · Chaleur forte (Vigilance)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Dans 2 jours</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  27°C · Averses tropicales
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Conseil agronomique du moment</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Période de récolte du maïs dans la Bouenza et le Niari. Pensez à aérer les sacs pour maintenir l'humidité sous 14% avant transport vers Brazzaville.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Pertes évitées estimées :
            </span>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              +1 450 kg
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders / Transactions Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Dernières commandes et réservations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paiement séquestre garanti par AgriLink Congo (Mobile Money)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Commande</th>
                <th className="pb-3 font-semibold">Produit</th>
                <th className="pb-3 font-semibold">Quantité</th>
                <th className="pb-3 font-semibold">Total payé</th>
                <th className="pb-3 font-semibold">Paiement Séquestre</th>
                <th className="pb-3 font-semibold">Statut Livraison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {orders.slice(0, 4).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 font-medium">{ord.productName}</td>
                  <td className="py-3 tabular-nums">
                    {ord.quantity} {ord.unit}
                  </td>
                  <td className="py-3 font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatFCFA(ord.totalPaid)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.escrowStatus === 'released'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : ord.escrowStatus === 'locked'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {ord.escrowStatus === 'released'
                        ? 'Libéré au producteur'
                        : ord.escrowStatus === 'locked'
                        ? 'Bloqué (Séquestre)'
                        : 'Litige / Retenu'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="capitalize font-medium text-slate-600 dark:text-slate-400">
                      {ord.deliveryStep === 'delivered'
                        ? 'Livré & Conforme'
                        : ord.deliveryStep === 'in_transit'
                        ? 'En route (RN1)'
                        : ord.deliveryStep === 'arrived'
                        ? 'Arrivé à destination'
                        : 'Accepté'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
