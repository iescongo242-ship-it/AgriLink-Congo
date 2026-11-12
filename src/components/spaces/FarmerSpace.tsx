import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product, OrderItem } from '../../types';
import {
  Sprout,
  Activity,
  Coins,
  PhoneCall,
  Clock,
  ArrowRight,
  Flame,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatFCFA } from '../../utils/calculations';

export const FarmerSpace: React.FC = () => {
  const {
    currentProfile,
    products,
    orders,
    freshGuardReadings,
    freshGuardConfig,
    setActiveTab,
    heatStock,
    coolStock,
  } = useApp();

  // Jean's own crops
  const myCrops = products.filter(
    (p: Product) =>
      p.farmerName.toLowerCase().includes(currentProfile.name.toLowerCase()) ||
      p.id === 'prod-manioc-01'
  );

  // Jean's orders
  const myOrders = orders.filter((o: OrderItem) => o.productId === 'prod-manioc-01');
  const totalStockKg = myCrops.reduce((acc: number, c: Product) => acc + c.availableStock, 0);
  const totalEarned = myOrders
    .filter((o: OrderItem) => o.escrowStatus === 'released')
    .reduce((acc: number, o: OrderItem) => acc + o.producerNet, 0);
  const totalPendingEscrow = myOrders
    .filter((o: OrderItem) => o.escrowStatus === 'locked')
    .reduce((acc: number, o: OrderItem) => acc + o.producerNet, 0);

  const latestSensor = freshGuardReadings[freshGuardReadings.length - 1];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#064E3B] to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-semibold text-emerald-200">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Espace Dédié Producteur Vivrier & Maraîcher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenue, {currentProfile.name}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Exploitant à Kinkala (Pool) · Vos récoltes sont directement reliées aux grossistes de Brazzaville avec paiement garanti sous séquestre Mobile Money.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('producer')}
            className="px-4 py-2.5 rounded-xl bg-[#159447] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sprout className="w-4 h-4" />
            <span>+ Publier une récolte</span>
          </button>
          <button
            onClick={() => setActiveTab('ussd')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Mode USSD (*140#)</span>
          </button>
        </div>
      </div>

      {/* 4 Producer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total available stock */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Mon Stock Actif en Vente</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            {totalStockKg} kg
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Manioc doux frais disponible
          </span>
        </div>

        {/* Pending Escrow Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">En Séquestre MoMo (En attente)</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums font-mono">
            {formatFCFA(totalPendingEscrow)}
          </p>
          <span className="text-[11px] text-slate-400">
            Déblocage automatique à la livraison
          </span>
        </div>

        {/* Released Money */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Gains Déjà Versés (Net)</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {formatFCFA(totalEarned)}
          </p>
          <span className="text-[11px] text-slate-400">
            Versés sur compte MTN MoMo
          </span>
        </div>

        {/* Warehouse Sensor */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Sonde Hangar Kinkala</span>
          <p
            className={`text-3xl font-black tabular-nums font-mono ${
              (latestSensor?.temperature || 24) >= freshGuardConfig.tempCriticalThreshold
                ? 'text-red-600 animate-pulse'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {latestSensor?.temperature || 24.5}°C
          </p>
          <span className="text-[11px] text-slate-400">
            Conservation estimée : {latestSensor?.estimatedDays || 7} jours
          </span>
        </div>
      </div>

      {/* Main Grid: My Crops Management & Warehouse FreshGuard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Harvests */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Mes Récoltes & Suivi des Stocks en Direct
              </h3>
              <p className="text-xs text-slate-500">
                Chaque réservation déduit immédiatement le stock pour éviter toute survente
              </p>
            </div>
            <button
              onClick={() => setActiveTab('producer')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Gérer tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {myCrops.map((crop: Product) => (
              <div
                key={crop.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {crop.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {crop.variety} · Récolté le {crop.harvestDate}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-mono font-bold text-emerald-600">
                        {formatFCFA(crop.pricePerUnit)} / kg
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Conservation : ~{crop.shelfLifeDays} jours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-xs text-slate-500">Stock restant :</span>
                  <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {crop.availableStock} kg{' '}
                    <span className="text-xs font-normal text-slate-400">
                      / {crop.totalQuantity} kg
                    </span>
                  </p>
                  <div className="w-32 sm:ml-auto h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (crop.availableStock / crop.totalQuantity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Warehouse FreshGuard Monitor with Heat/Cool buttons */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Mon Capteur FreshGuard Hangar</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Kinkala #01
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center space-y-2 border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-500">Conditions actuelles du hangar :</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {latestSensor?.temperature || 24.5}°C
              </p>
              <div className="flex justify-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span>Humidité : {latestSensor?.humidity || 75}%</span>
                <span>Gaz : {latestSensor?.gasIndex || 1.0}</span>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={heatStock}
                className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Chauffer (+3°C)</span>
              </button>
              <button
                onClick={coolStock}
                className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Snowflake className="w-3.5 h-3.5 text-blue-600" />
                <span>Refroidir</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
            Conseil de Kinkala : aérer le hangar tôt le matin avant 08h pour maintenir une température inférieure à 26°C.
          </div>
        </div>
      </div>
    </div>
  );
};
