import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ThermometerSnowflake,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Phone,
  Flame,
  Snowflake,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const TransportView: React.FC = () => {
  const {
    orders,
    transportOffers,
    advanceDeliveryStep,
    confirmReceptionAndReleaseFunds,
    openDispute,
    inTransitTruckTemp,
    inTransitHistory,
    heatStock,
    coolStock,
    freshGuardConfig,
    setActiveTab,
    t,
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Steps configuration
  const steps: { key: any; label: string; index: number }[] = [
    { key: 'pending', label: t.stepPending, index: 1 },
    { key: 'accepted', label: t.stepAccepted, index: 2 },
    { key: 'in_transit', label: t.stepInTransit, index: 3 },
    { key: 'arrived', label: t.stepArrived, index: 4 },
    { key: 'delivered', label: t.stepDelivered, index: 5 },
  ];

  const currentStepIndex = steps.find((s) => s.key === activeOrder?.deliveryStep)?.index || 2;

  // Truck position on the schematic SVG map based on step
  const truckPos =
    currentStepIndex === 1
      ? { x: 50, y: 70, label: 'Kinkala (Départ)' }
      : currentStepIndex === 2
      ? { x: 120, y: 75, label: 'Chargement Kinkala' }
      : currentStepIndex === 3
      ? { x: 250, y: 80, label: 'En transit RN1' }
      : currentStepIndex === 4
      ? { x: 380, y: 85, label: 'Périphérie Brazzaville' }
      : { x: 440, y: 90, label: 'Marché Total (Livré)' };

  const isColdChainBreached = inTransitTruckTemp >= freshGuardConfig.tempCriticalThreshold;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-orange-600" />
            <span>Transport Frigorifique & FreshGuard Route</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Traçabilité GPS et contrôle thermique continu le long du corridor national (RN1)
          </p>
        </div>

        {/* Order Selector */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Commande :</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} - {o.productName} ({o.quantity} kg)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeOrder ? (
        <>
          {/* 5-Step Delivery Progression Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Progression de l'expédition
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lot {activeOrder.orderNumber} · {activeOrder.quantity} kg de {activeOrder.productName}
                </h3>
              </div>

              {/* Advance Step Action Button */}
              {activeOrder.deliveryStep !== 'delivered' && (
                <button
                  onClick={() => advanceDeliveryStep(activeOrder.id)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <span>{t.advanceStepBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Stepper Visual */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {steps.map((s) => {
                const isPassed = currentStepIndex >= s.index;
                const isCurrent = currentStepIndex === s.index;
                return (
                  <div key={s.key} className="text-center space-y-1.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-orange-600'
                          : isPassed
                          ? 'bg-emerald-600'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                    <span
                      className={`text-[11px] block truncate font-medium ${
                        isCurrent
                          ? 'text-orange-600 dark:text-orange-400 font-bold'
                          : isPassed
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schematic SVG Map & FreshGuard Route Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Schematic SVG Road Corridor */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Carte Schématique Corridor National (RN1)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Suivi GPS simulé · Hors-ligne
                </span>
              </div>

              {/* Schematic Map Container */}
              <div className="relative w-full h-52 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 500 160" className="w-full h-full">
                  {/* Congo River schematic outline */}
                  <path
                    d="M 380 0 Q 430 80 470 160"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    fill="none"
                    opacity="0.25"
                  />
                  <text x="420" y="40" fill="#3B82F6" fontSize="10" opacity="0.6">
                    Fleuve Congo
                  </text>

                  {/* Highway RN1 Line */}
                  <path
                    d="M 40 70 C 150 60, 250 90, 440 90"
                    stroke="#94A3B8"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 40 70 C 150 60, 250 90, 440 90"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Waypoint 1: Kinkala (Pool) */}
                  <circle cx="50" cy="70" r="7" fill="#159447" />
                  <text x="50" y="52" textAnchor="middle" fill="currentColor" className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Kinkala (Pool)
                  </text>
                  <text x="50" y="92" textAnchor="middle" fill="#64748B" className="text-[8px]">
                    Origine récolte
                  </text>

                  {/* Waypoint 2: Mid-transit checkpoint */}
                  <circle cx="250" cy="80" r="4" fill="#64748B" />
                  <text x="250" y="105" textAnchor="middle" fill="#64748B" className="text-[9px]">
                    Poste PK 45 (RN1)
                  </text>

                  {/* Waypoint 3: Brazzaville (Marché Total) */}
                  <circle cx="440" cy="90" r="8" fill="#DC2626" />
                  <text x="440" y="72" textAnchor="middle" fill="currentColor" className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Brazzaville
                  </text>
                  <text x="440" y="112" textAnchor="middle" fill="#64748B" className="text-[8px]">
                    Marché Total (Arrivée)
                  </text>

                  {/* Animated / Positioned Truck Marker */}
                  <g transform={`translate(${truckPos.x - 14}, ${truckPos.y - 14})`}>
                    <rect width="28" height="28" rx="7" fill="#F97316" className="shadow-lg" />
                    <text x="14" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="13">
                      🚚
                    </text>
                  </g>
                </svg>

                {/* Live truck tag */}
                <div className="absolute bottom-2 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>Position : {truckPos.label}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Live FreshGuard Route Temperature */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                    <span>{t.liveTruckTemp}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Sonde Frigo</span>
                </div>

                <div className="mt-4 text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500">Température de la cargaison</span>
                  <p
                    className={`text-4xl font-black mt-1 tabular-nums ${
                      isColdChainBreached ? 'text-red-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {inTransitTruckTemp}°C
                  </p>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
                    {isColdChainBreached
                      ? '⚠️ RUPTURE CHAÎNE DU FROID (> 30°C)'
                      : '✅ Conforme (Sous le seuil 30°C)'}
                  </span>
                </div>

                {/* Simulation test triggers for dispute demo */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={heatStock}
                    className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-200 flex items-center justify-center gap-1 cursor-pointer"
                    title="Chauffer pendant le trajet pour tester la variante litige (>30°C)"
                  >
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>Chauffer (+3°C)</span>
                  </button>
                  <button
                    onClick={coolStock}
                    className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Snowflake className="w-3 h-3 text-blue-600" />
                    <span>Rétablir froid</span>
                  </button>
                </div>
              </div>

              {/* Carrier details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Chauffeur :</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeOrder.transporterName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Contact :</span>
                  <span className="font-mono">{activeOrder.transporterPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Audit Report (Generated upon arrival or completion) */}
          {activeOrder.deliveryReport && (
            <div
              className={`rounded-2xl p-6 border shadow-md space-y-4 animate-in fade-in duration-200 ${
                activeOrder.deliveryReport.coldChainRespected
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <FileCheck
                    className={`w-6 h-6 ${
                      activeOrder.deliveryReport.coldChainRespected
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {t.deliveryReportTitle} ({activeOrder.deliveryReport.id})
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Horodaté le {activeOrder.deliveryReport.generatedAt} · Corridor RN1 Kinkala-Brazzaville
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                    activeOrder.deliveryReport.coldChainRespected
                      ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                      : 'bg-red-200 text-red-950 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {activeOrder.deliveryReport.coldChainRespected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.coldChainOk}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.coldChainBroken}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Metrics audit table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10">
                  <span className="text-slate-500">Température Maximale :</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {activeOrder.deliveryReport.maxTemperature}°C
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10">
                  <span className="text-slate-500">Seuil critique max :</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {activeOrder.deliveryReport.thresholdTemperature}°C
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10">
                  <span className="text-slate-500">Durée du trajet :</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {activeOrder.deliveryReport.durationMinutes} min
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-black/5 dark:border-white/10">
                  <span className="text-slate-500">Statut du Séquestre :</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {activeOrder.escrowStatus === 'released'
                      ? 'Fonds libérés'
                      : activeOrder.escrowStatus === 'locked'
                      ? 'En attente acheteur'
                      : 'Retenu (Litige)'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeOrder.deliveryReport.details}
              </p>

              {/* Action buttons based on report */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {activeOrder.deliveryReport.coldChainRespected ? (
                  activeOrder.escrowStatus === 'locked' ? (
                    <button
                      onClick={() => confirmReceptionAndReleaseFunds(activeOrder.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Valider la réception & Libérer les fonds ({formatFCFA(activeOrder.totalPaid)})</span>
                    </button>
                  ) : (
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Fonds versés au producteur et au transporteur. Transaction clôturée.</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openDispute(activeOrder.id, 'Rupture constatée de la chaîne du froid (>30°C).')}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Ouvrir un litige officiel (Paiement bloqué)</span>
                    </button>
                    <span className="text-xs text-red-700 dark:text-red-300">
                      Les fonds restent consignés jusqu'à conciliation.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
          Aucune commande active pour le moment.
        </div>
      )}

      {/* Available Carrier Offers Directory */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Offres de transport frigorifique disponibles sur le réseau ({transportOffers.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transportOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {offer.transporterName}
                  </h4>
                  <p className="text-[11px] text-slate-500">{offer.vehicleType}</p>
                </div>
                {offer.isRefrigerated && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    FRIGO
                  </span>
                )}
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Itinéraire :</span>
                  <span className="font-medium text-right">{offer.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacité :</span>
                  <span className="font-mono">{offer.capacityKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif indicatif :</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {offer.pricePerKg} FCFA / kg
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{offer.phone}</span>
                <span className="text-emerald-600 font-medium">{offer.availableDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
