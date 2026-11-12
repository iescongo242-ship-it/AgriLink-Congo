import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { formatFCFA } from '../../utils/calculations';

export const BuyerSpace: React.FC = () => {
  const {
    currentProfile,
    products,
    orders,
    confirmReceptionAndReleaseFunds,
    openDispute,
    setActiveTab,
  } = useApp();

  const myOrders = orders;
  const lockedOrders = myOrders.filter((o: OrderItem) => o.escrowStatus === 'locked');
  const arrivedOrders = myOrders.filter((o: OrderItem) => o.deliveryStep === 'arrived');
  const totalLockedAmount = lockedOrders.reduce((acc: number, o: OrderItem) => acc + o.totalPaid, 0);
  const totalVolumePurchased = myOrders.reduce((acc: number, o: OrderItem) => acc + o.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-600/60 text-xs font-semibold text-blue-200">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span>Espace Dédié Grossiste en Vivres Frais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentProfile.name}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Marché Total (Bacongo, Brazzaville) · Vous commandez directement auprès des producteurs avec la garantie absolue du séquestre : l'argent n'est débloqué qu'à réception d'une marchandise saine.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('market')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explorer le Marché</span>
          </button>
        </div>
      </div>

      {/* 4 Buyer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Mes Commandes en Cours</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            {lockedOrders.length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">
            En route ou en préparation
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total en Séquestre Garanti</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums font-mono">
            {formatFCFA(totalLockedAmount)}
          </p>
          <span className="text-[11px] text-slate-400">
            Protégé contre les avaries
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">À Réceptionner au Marché Total</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {arrivedOrders.length}
          </p>
          <span className="text-[11px] text-slate-400">
            Rapport d'audit prêt à valider
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Volume Total Approvisionné</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
            {totalVolumePurchased} kg
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            Manioc, maïs & tomates
          </span>
        </div>
      </div>

      {/* Orders to Validate & Active Orders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Suivi de mes Commandes & Validation Séquestre
            </h3>
            <p className="text-xs text-slate-500">
              Vérifiez la conformité de la chaîne du froid avant de libérer le paiement
            </p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Registre complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {myOrders.map((ord: OrderItem) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                    {ord.orderNumber}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {ord.productName} ({ord.quantity} kg)
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Transporteur : {ord.transporterName} · Total séquestre :{' '}
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {formatFCFA(ord.totalPaid)}
                  </strong>
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                    Livraison : {ord.deliveryStep}
                  </span>
                  {ord.deliveryReport && (
                    <span
                      className={`font-semibold ${
                        ord.deliveryReport.coldChainRespected
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      (Max {ord.deliveryReport.maxTemperature}°C)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {ord.escrowStatus === 'locked' && (
                  <>
                    <button
                      onClick={() => confirmReceptionAndReleaseFunds(ord.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Valider & Libérer ({formatFCFA(ord.totalPaid)})</span>
                    </button>
                    <button
                      onClick={() => openDispute(ord.id, "Rupture thermique ou marchandise non conforme à l'arrivée.")}
                      className="px-3 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                    >
                      Litige
                    </button>
                  </>
                )}

                {ord.escrowStatus === 'released' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Fonds Libérés · Commande Clôturée</span>
                  </span>
                )}

                {ord.escrowStatus === 'disputed_frozen' && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Litige en cours · Fonds Bloqués</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
